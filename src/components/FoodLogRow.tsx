import type { FoodLog } from '../types';

export function FoodLogRow({ entry }: { entry: FoodLog }) {
	const { datetime, food, amount, macronutrients } = entry;
	const time = datetime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

	return (
		<tr class="group-row">
			<td></td>
			<td>{time}</td>
			<td>{food.name}</td>
			<td>
				{amount.amount} {amount.unit}
			</td>
			<td>{macronutrients.calories}kCal</td>
			<td>{macronutrients.protein}g</td>
			<td>{macronutrients.fat}g</td>
			<td>{macronutrients.carbs}g</td>
		</tr>
	);
}
