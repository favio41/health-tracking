import { Fragment } from 'preact';
import { useState } from 'preact/hooks';
import type { FoodLog } from '../types';
import { aggregateMacronutrients } from '../utils';
import { FoodLogRow } from './FoodLogRow';

const MEAL_GROUPS = ['Breakfast', 'Night', 'Brunch / Snack', 'Lunch', 'Snack PM', 'Dinner'] as const;
type MealGroup = (typeof MEAL_GROUPS)[number];

function getMealGroup(datetime: Date): MealGroup {
	const hour = datetime.getHours();

	if (hour >= 5 && hour < 11) return 'Breakfast';
	if (hour >= 11 && hour < 12) return 'Brunch / Snack';
	if (hour >= 12 && hour < 16) return 'Lunch';
	if (hour >= 16 && hour < 18) return 'Snack PM';
	if (hour >= 18 && hour < 23) return 'Dinner';
	return 'Night';
}

export function FoodLogsGroupedByTime({ foodLogs }: { foodLogs: FoodLog[] }) {
	const [collapsedMeals, setCollapsedMeals] = useState<Set<MealGroup>>(new Set());

	const grouped = foodLogs.reduce(
		(acc, entry) => {
			const group = getMealGroup(entry.datetime);
			if (!acc[group]) acc[group] = [];
			acc[group].push(entry);
			return acc;
		},
		{} as Record<MealGroup, FoodLog[]>,
	);

	const sortedByTime = Object.fromEntries(
		Object.entries(grouped).map(([group, items]) => [
			group,
			items.sort((a, b) => a.datetime.getTime() - b.datetime.getTime()),
		]),
	);

	const toggleMeal = (meal: MealGroup) => {
		const newCollapsed = new Set(collapsedMeals);
		if (newCollapsed.has(meal)) {
			newCollapsed.delete(meal);
		} else {
			newCollapsed.add(meal);
		}
		setCollapsedMeals(newCollapsed);
	};

	return (
		<>
			{MEAL_GROUPS.map((group) => {
				const items = sortedByTime[group];
				if (!items || items.length === 0) return null;

				const isCollapsed = collapsedMeals.has(group);
				const macronutrients = aggregateMacronutrients(items);

				return (
					<Fragment key={group}>
						<tr class="group-header" onClick={() => toggleMeal(group)}>
							<td></td>
							<td>
								<span class={`group-toggle${isCollapsed ? ' collapsed' : ''}`}>⏷</span>
							</td>
							<td colSpan={2} style="text-align: right; font-size: 0.9em; font-weight: normal;">
								<strong style="font-weight: 600; float: left;">{group}</strong>
							</td>
							<td>{macronutrients.calories}kCal</td>
							<td>{macronutrients.protein}g</td>
							<td>{macronutrients.fat}g</td>
							<td>{macronutrients.carbs}g</td>
						</tr>
						{!isCollapsed &&
							items.map((entry) => (
								<FoodLogRow key={`${entry.food.id}-${entry.datetime.toISOString()}`} entry={entry} />
							))}
					</Fragment>
				);
			})}
		</>
	);
}
