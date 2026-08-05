import type { FoodLog } from '../types';

export function FoodLogRow({ entry, onDelete }: { entry: FoodLog; onDelete: (id: string) => void }) {
	const { datetime, food, amount, macronutrients } = entry;
	const time = datetime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

	const handleDelete = () => {
		if (window.confirm('Delete this entry?')) {
			onDelete(entry.id);
		}
	};

	return (
		<tr class="group-row">
			<td>
				<button className="action" type="button" onClick={handleDelete}>
					✕
				</button>
			</td>
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
