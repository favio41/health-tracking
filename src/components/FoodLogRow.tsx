import type { FoodLog } from '../types';

export function FoodLogRow({
	entry,
	onDelete,
	onEdit,
}: {
	entry: FoodLog;
	onDelete: (id: string) => void;
	onEdit: (entry: FoodLog) => void;
}) {
	const { datetime, food, amount, macronutrients } = entry;
	const time = datetime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

	const handleDelete = () => {
		if (window.confirm('Delete this entry?')) {
			onDelete(entry.id);
		}
	};

	return (
		<tr class="group-row">
			<td></td>
			<td className="action">
				<button type="button" onClick={() => onEdit(entry)} title="Edit">
					✎
				</button>
				<button type="button" onClick={handleDelete} title="Delete">
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
