import { useState } from 'preact/hooks';
import type { FoodLog } from '../types';
import { aggregateMacronutrients } from '../utils';
import { FoodLogsGroupedByTime } from './FoodLogsGroupedByTime';

function getDayKey(datetime: Date): string {
	const year = datetime.getFullYear();
	const month = String(datetime.getMonth() + 1).padStart(2, '0');
	const day = String(datetime.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
}

function formatDay(dayKey: string): string {
	const [year, month, day] = dayKey.split('-').map(Number);
	const date = new Date(year, month - 1, day);
	return date.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
}

export function FoodLogsGroupedByDay({ foodLogs }: { foodLogs: FoodLog[] }) {
	const [collapsedDays, setCollapsedDays] = useState<Set<string>>(new Set());

	const grouped = foodLogs.reduce(
		(acc, foodLog) => {
			const dayKey = getDayKey(foodLog.datetime);
			if (!acc[dayKey]) acc[dayKey] = [];
			acc[dayKey].push(foodLog);
			return acc;
		},
		{} as Record<string, FoodLog[]>,
	);

	const sortedDays = Object.keys(grouped).sort().reverse();

	const toggleDay = (dayKey: string) => {
		const newCollapsed = new Set(collapsedDays);
		if (newCollapsed.has(dayKey)) {
			newCollapsed.delete(dayKey);
		} else {
			newCollapsed.add(dayKey);
		}
		setCollapsedDays(newCollapsed);
	};

	return (
		<div class="table-container">
			<table>
				<thead>
					<tr>
						<th style="width: 24px;"></th>
						<th>Time</th>
						<th>Food</th>
						<th>Amount</th>
						<th>Calories</th>
						<th>Protein</th>
						<th>Fat</th>
						<th>Carbs</th>
					</tr>
				</thead>
				<tbody>
					{sortedDays.map((dayKey) => {
						const items = grouped[dayKey];
						const label = formatDay(dayKey);
						const isCollapsed = collapsedDays.has(dayKey);
						const macronutrients = aggregateMacronutrients(items);

						return (
							<>
								<tr key={`header-${dayKey}`} class="group-header" onClick={() => toggleDay(dayKey)}>
									<td>
										<span class={`group-toggle${isCollapsed ? ' collapsed' : ''}`}>⏷</span>
									</td>
									<td colSpan={3} style="text-align: right; font-size: 0.9em; font-weight: normal;">
										<strong style="font-weight: 600; float: left;">{label}</strong>
									</td>
									<td>{macronutrients.calories}kCal</td>
									<td>{macronutrients.protein}g</td>
									<td>{macronutrients.fat}g</td>
									<td>{macronutrients.carbs}g</td>
								</tr>
								{!isCollapsed && <FoodLogsGroupedByTime foodLogs={items} />}
							</>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}
