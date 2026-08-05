export interface FoodMacronutrients {
	calories: number;
	protein: number;
	fat: number;
	carbs: number;
	sugar?: number;
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
	datetime: Date;
	food: Food;
	amount: FoodLogAmount;
	macronutrients: FoodMacronutrients;
}
