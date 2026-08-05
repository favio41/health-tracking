import type { FoodLog } from '../types';

export const aggregateMacronutrients = (items: FoodLog[]) => {
	return items.reduce(
		(acc, entry) => ({
			calories: acc.calories + entry.macronutrients.calories,
			protein: acc.protein + entry.macronutrients.protein,
			fat: acc.fat + entry.macronutrients.fat,
			carbs: acc.carbs + entry.macronutrients.carbs,
		}),
		{ calories: 0, protein: 0, fat: 0, carbs: 0 },
	);
};
