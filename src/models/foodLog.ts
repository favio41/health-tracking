import type { Food, FoodLog, FoodLogAmount, Unit } from '../types';

const unitConversions: Record<Unit, number> = {
	g: 1,
	ml: 1,
	oz: 28.35,
	cup: 240,
	serving: 100,
};

export function FoodLogModel(datetime: Date, food: Food, amount: FoodLogAmount): FoodLog {
	return {
		id: crypto.randomUUID(),
		datetime: datetime,
		food: food,
		amount: amount,
		get macronutrients() {
			const { unit, amount } = this.amount;
			const grams = amount * unitConversions[unit];
			const scale = grams / 100;

			return {
				calories: Math.round(food.calories * scale),
				protein: Math.round(food.protein * scale * 10) / 10,
				fat: Math.round(food.fat * scale * 10) / 10,
				carbs: Math.round(food.carbs * scale * 10) / 10,
				sugar: food.sugar ? Math.round(food.sugar * scale * 10) / 10 : 0,
			};
		},
	};
}
