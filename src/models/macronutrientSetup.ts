import type {
	MacronutrientGoals,
	MacronutrientGoalsWeekItem,
	MacronutrientSetup,
	Settings,
	TrainingWeeks,
} from '../types';

const calorieMultiplierTable = [
	{ from: 0, to: 12, multiplier: 17 },
	{ from: 12.1, to: 15, multiplier: 16 },
	{ from: 15.1, to: 19, multiplier: 15 },
	{ from: 19.1, to: 22, multiplier: 14 },
	{ from: 22.1, to: 100, multiplier: 13 },
];

function getCalorieMultiplier(bodyFatPercentage: number): number {
	for (const row of calorieMultiplierTable) {
		if (bodyFatPercentage >= row.from && bodyFatPercentage <= row.to) {
			return row.multiplier;
		}
	}
	return 13;
}

export function MacronutrientSetupModel(settings: Settings): MacronutrientSetup | null {
	if (settings.weightKg === undefined || settings.bodyFatPercentage === undefined) {
		return null;
	}

	const currentWeightLb = settings.weightKg * 2.20462;
	const bodyFatPercentage = settings.bodyFatPercentage / 100;
	const bodyFatLb = currentWeightLb * bodyFatPercentage;
	const leanBodyMassLb = currentWeightLb - bodyFatLb;

	const calorieMultiplier = getCalorieMultiplier(settings.bodyFatPercentage);
	const maintenanceCalories = Math.round(leanBodyMassLb * calorieMultiplier);

	const roundedLeanBodyMassLb = Math.round(leanBodyMassLb * 100) / 100;

	return {
		currentWeightLb: Math.round(currentWeightLb * 100) / 100,
		bodyFatLb: Math.round(bodyFatLb * 100) / 100,
		leanBodyMassLb: roundedLeanBodyMassLb,
		calorieMultiplier,
		maintenanceCalories,
	};
}
