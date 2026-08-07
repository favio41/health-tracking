import { Check, type LucideIcon, Minus, TrendingUp, X } from 'lucide-preact';
import { useState } from 'preact/hooks';
import { useSettings } from '@/context/settings';
import { useTrainingScheduleBaseline } from '@/context/training-schedule-baseline';
import { useTrainingDaysLog } from '@/context/trainingDaysLog';
import { trainingAndMacronutritionOnDay } from '@/models/trainingAndMacronutritionSchedule';
import type { FoodLog } from '@/types';
import { aggregateMacronutrients, formatNumber } from '@/utils';
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

type MacroStatus = 'none' | 'wellUnder' | 'closeUnder' | 'above';

function getMacroStatus(actual: number, target: number): MacroStatus {
	if (actual === 0) return 'none';
	if (actual > target) return 'above';
	if (actual >= target * 0.9) return 'closeUnder';
	return 'wellUnder';
}

const STATUS_STYLE: Record<MacroStatus, { icon: LucideIcon; color: string }> = {
	none: { icon: Minus, color: 'var(--pico-muted-color)' },
	above: { icon: X, color: '#dc2626' },
	closeUnder: { icon: TrendingUp, color: '#d38123' },
	wellUnder: { icon: Check, color: '#16a34a' },
};

function MacroCell({ value, unit, target }: { value: number; unit: string; target?: number }) {
	const status = target != null ? getMacroStatus(value, target) : null;
	const { icon: Icon, color } = status ? STATUS_STYLE[status] : { icon: null, color: undefined };
	return (
		<td data-tooltip={target != null ? `Target: ${formatNumber(target)}${unit}` : undefined}>
			{Icon && <Icon size={14} color={color} />}
			{formatNumber(value)}
			{unit}
		</td>
	);
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
	const { settings } = useSettings();
	const { trainingDaysLog } = useTrainingDaysLog();
	const trainingScheduleBaseline = useTrainingScheduleBaseline();

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
							<th colSpan={3}>Time</th>
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

							const [year, month, day] = dayKey.split('-').map(Number);
							const dayDate = new Date(year, month - 1, day);
							const schedule =
								settings.trainingStartDate && trainingScheduleBaseline
									? trainingAndMacronutritionOnDay({
											settings,
											trainingDayLog: trainingDaysLog,
											date: dayDate,
											trainingScheduleBaseline,
										})
									: null;
							const targets = schedule?.macronutritionGoals ?? null;

							return (
								<>
									<tr key={`header-${dayKey}`} class="group-header" onClick={() => toggleDay(dayKey)}>
										<td>
											<span class={`group-toggle${isCollapsed ? ' collapsed' : ''}`}>⏷</span>
										</td>
										<td colSpan={4} style="text-align: right; font-size: 0.9em; font-weight: normal;">
											<strong style="font-weight: 600; float: left;">{label}</strong>
										</td>
										<MacroCell value={macronutrients.calories} unit="kCal" target={targets?.calories} />
										<MacroCell value={macronutrients.protein} unit="g" target={targets?.protein} />
										<MacroCell value={macronutrients.fat} unit="g" target={targets?.fat} />
										<MacroCell value={macronutrients.carbs} unit="g" target={targets?.carbs} />
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
