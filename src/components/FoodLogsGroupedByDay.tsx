import { useState } from 'preact/hooks';
import type { FoodLog } from '../types';
import { aggregateMacronutrients, formatNumber } from '../utils';
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

export function FoodLogsGroupedByDay({
	foodLogs,
	onDelete,
	onEdit,
	visibilityDays,
}: {
	foodLogs: FoodLog[];
	onDelete: (id: string) => void;
	onEdit: (entry: FoodLog) => void;
	visibilityDays: number;
}) {
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
	const [visibleDayCount, setVisibleDayCount] = useState(visibilityDays);
	const visibleDays = sortedDays.slice(0, visibleDayCount);

	const [collapsedDays, setCollapsedDays] = useState<Set<string>>(() => {
		const collapsed = new Set(sortedDays.slice(1));
		return collapsed;
	});

	const toggleDay = (dayKey: string) => {
		const newCollapsed = new Set(collapsedDays);
		if (newCollapsed.has(dayKey)) {
			newCollapsed.delete(dayKey);
		} else {
			newCollapsed.add(dayKey);
		}
		setCollapsedDays(newCollapsed);
	};

	if (sortedDays.length === 0) {
		return <p>No food logs found. Start by adding your first entry!</p>;
	}

	return (
		<>
			<div class="table-container">
				<table>
					<thead>
						<tr>
							<th style="width: 24px;"></th>
							<th></th>
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
						{visibleDays.map((dayKey) => {
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
										<td colSpan={4} style="text-align: right; font-size: 0.9em; font-weight: normal;">
											<strong style="font-weight: 600; float: left;">{label}</strong>
										</td>
										<td>{macronutrients.calories}kCal</td>
										<td>{formatNumber(macronutrients.protein)}g</td>
										<td>{formatNumber(macronutrients.fat)}g</td>
										<td>{formatNumber(macronutrients.carbs)}g</td>
									</tr>
									{!isCollapsed && <FoodLogsGroupedByTime foodLogs={items} onDelete={onDelete} onEdit={onEdit} />}
								</>
							);
						})}
					</tbody>
				</table>
			</div>
			{visibleDayCount < sortedDays.length && (
				<div style="text-align: center; margin-top: 1rem;">
					<button type="button" onClick={() => setVisibleDayCount(visibleDayCount + visibilityDays)}>
						Load more
					</button>
				</div>
			)}
		</>
	);
}
