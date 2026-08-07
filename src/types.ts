export interface Settings {
	trainingStartDate?: Date;
	weightKg?: number;
	bodyFatPercentage?: number;
}

export interface FoodMacronutrients {
	calories: number;
	protein: number;
	fat: number;
	carbs: number;
	sugar?: number;
}

export interface MacronutrientSetup {
	currentWeightLb: number;
	bodyFatLb: number;
	leanBodyMassLb: number;
	calorieMultiplier: number;
	maintenanceCalories: number;
}

export type Food = {
	source: 'uk-coFID' | 'USDA' | 'custom';
	id: string;
	name: string;
} & FoodMacronutrients;

export type Unit = 'g' | 'ml' | 'oz' | 'cup' | 'serving';

export interface FoodLogAmount {
	unit: Unit;
	amount: number;
}

export interface FoodLog {
	id: string;
	datetime: Date;
	food: Food;
	amount: FoodLogAmount;
	macronutrients: FoodMacronutrients;
}

export interface ImportResult {
	imported: number;
	failed: number;
	skipped: number;
}

export type TrainingOptions = '1' | '2' | '3' | '4' | 'OFF' | 'CARDIO';
export type NutritionOptions = '16/8' | 'CHEAT_DAY' | 'FULL_FAST';
export type Phases = 'prime' | 'adapt' | 'surge' | 'complete';
export type TrainingWeeks = 'week1' | 'week2' | 'week3' | 'week4' | 'all';

export type TrainingScheduleBaseline = Record<
	Phases,
	{
		training: TrainingOptions[];
		nutrition?: NutritionOptions[];
	}
>;

export type MacronutrientGoalsWeekItem = Record<
	TrainingWeeks,
	{
		workout: FoodMacronutrients;
		nonWorkout: FoodMacronutrients;
	}
>;

export type MacronutrientGoals = Record<Phases, MacronutrientGoalsWeekItem>;

export type TrainingDayLogType = 'SKIPPED';

export interface TrainingDayLog {
	id: string;
	datetime: Date;
	type: TrainingDayLogType;
}

export interface ScheduleGrid {
	date: Date;
	phase?: Phases;
	status: 'BEFORE_START_DATE' | 'OK' | 'SKIPPED' | 'AFTER_END_DATE';
	training?: TrainingOptions;
	nutrition?: NutritionOptions;
	macronutritionGoals?: FoodMacronutrients | null;
}
