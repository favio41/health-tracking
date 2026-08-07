import type { MacronutrientGoals, MacronutrientGoalsWeekItem, Phases, Settings, TrainingWeeks } from '../types';
import { MacronutrientSetupModel } from './macronutrientSetup';

interface PhaseTrainingConfig {
	workoutProteinMultiplier: number;
	nonWorkoutProteinMultiplier: number;
	workoutCarbMultiplier: number;
	nonWorkoutCarbMultiplier: number;
	workoutCalorieOffset: number;
	nonWorkoutCalorieOffset: number;
}
type NonPrimePhases = Exclude<Phases, 'prime'>;

const primePhaseCarbs = [
	{ week: 'week1', workoutCarbs: 30, nonWorkoutCarbs: 0 },
	{ week: 'week2', workoutCarbs: 30, nonWorkoutCarbs: 0 },
	{ week: 'week3', workoutCarbs: 75, nonWorkoutCarbs: 0 },
	{ week: 'week4', workoutCarbs: 100, nonWorkoutCarbs: 50 },
] as const satisfies Array<{ week: TrainingWeeks; workoutCarbs: number; nonWorkoutCarbs: number }>;

const phaseTrainingConfigs: Record<NonPrimePhases, PhaseTrainingConfig> = {
	adapt: {
		workoutProteinMultiplier: 1.0,
		nonWorkoutProteinMultiplier: 0.8,
		workoutCarbMultiplier: 0.75,
		nonWorkoutCarbMultiplier: 0.3,
		workoutCalorieOffset: -200,
		nonWorkoutCalorieOffset: -600,
	},
	surge: {
		workoutProteinMultiplier: 1.5,
		nonWorkoutProteinMultiplier: 1.25,
		workoutCarbMultiplier: 1.0,
		nonWorkoutCarbMultiplier: 0.5,
		workoutCalorieOffset: 400,
		nonWorkoutCalorieOffset: -200,
	},
	complete: {
		workoutProteinMultiplier: 1.5,
		nonWorkoutProteinMultiplier: 1.0,
		workoutCarbMultiplier: 1.0,
		nonWorkoutCarbMultiplier: 0.25,
		workoutCalorieOffset: 300,
		nonWorkoutCalorieOffset: -400,
	},
};

export function getMacronutrientGoals(settings: Settings): MacronutrientGoals | null {
	const setup = MacronutrientSetupModel(settings);
	if (!setup) {
		return null;
	}

	const primeGoals = {} as MacronutrientGoalsWeekItem;

	for (const { week, workoutCarbs, nonWorkoutCarbs } of primePhaseCarbs) {
		const workoutCalories = setup.maintenanceCalories - 300;
		const nonWorkoutCalories = setup.maintenanceCalories - 500;

		const workoutProteinGrams = Math.round(setup.leanBodyMassLb * 0.8);
		const nonWorkoutProteinGrams = Math.round(setup.leanBodyMassLb * 0.7);

		primeGoals[week] = {
			workout: calculateMacros(workoutCalories, workoutProteinGrams, workoutCarbs),
			nonWorkout: calculateMacros(nonWorkoutCalories, nonWorkoutProteinGrams, nonWorkoutCarbs),
		};
	}

	const adaptGoals = generateGoals('adapt');
	const surgeGoals = generateGoals('surge');
	const completeGoals = generateGoals('complete');

	return { prime: primeGoals, adapt: adaptGoals, surge: surgeGoals, complete: completeGoals } as MacronutrientGoals;

	function generateGoals(phase: NonPrimePhases) {
		if (!setup) {
			return null;
		}

		const config = phaseTrainingConfigs[phase];
		const phaseGoals = {} as MacronutrientGoalsWeekItem;

		const workoutCalories = setup.maintenanceCalories + config.workoutCalorieOffset;
		const nonWorkoutCalories = setup.maintenanceCalories + config.nonWorkoutCalorieOffset;

		const workoutProteinGrams = Math.round(setup.leanBodyMassLb * config.workoutProteinMultiplier);
		const nonWorkoutProteinGrams = Math.round(setup.leanBodyMassLb * config.nonWorkoutProteinMultiplier);

		const workoutCarbGrams = Math.round(setup.leanBodyMassLb * config.workoutCarbMultiplier);
		const nonWorkoutCarbGrams = Math.round(setup.leanBodyMassLb * config.nonWorkoutCarbMultiplier);

		phaseGoals.all = {
			workout: calculateMacros(workoutCalories, workoutProteinGrams, workoutCarbGrams),
			nonWorkout: calculateMacros(nonWorkoutCalories, nonWorkoutProteinGrams, nonWorkoutCarbGrams),
		};
		return phaseGoals;
	}
}

function calculateMacros(calories: number, proteinGrams: number, carbGrams: number) {
	const proteinCals = proteinGrams * 4;
	const carbCals = carbGrams * 4;
	const fatGrams = Math.round((calories - proteinCals - carbCals) / 9);

	return {
		calories,
		protein: proteinGrams,
		fat: fatGrams,
		carbs: carbGrams,
	};
}
