import type { Food } from '../types';

export function FoodMacros({ food }: { food: Food }) {
	return (
		<div>
			<span className="macro-calories">Calories: {food.calories}</span>
			<span className="macro-protein">Protein: {food.protein}g</span>
			<span className="macro-fat">Fat: {food.fat}g</span>
			<span className="macro-carbs">Carbs: {food.carbs}g</span>
		</div>
	);
}
