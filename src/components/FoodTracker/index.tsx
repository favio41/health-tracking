import { useFoodLogs } from '@/context/foodLogs';
import type { FoodLog } from '@/types';
import { FoodLogsGroupedByDay } from './FoodLogsGroupedByDay';

interface FoodTrackerProps {
	onAddEntry: () => void;
	onEditEntry: (entry: FoodLog) => void;
}

export function FoodTracker({ onAddEntry, onEditEntry }: FoodTrackerProps) {
	const { foodLogs, removeFoodLog } = useFoodLogs();

	return (
		<article>
			<nav>
				<ul>
					<li>
						<h2>Food Tracker</h2>
					</li>
				</ul>
				<ul>
					<li>
						<button type="button" onClick={onAddEntry}>
							Add Food Log Entry
						</button>
					</li>
				</ul>
			</nav>
			{foodLogs.length === 0 ? (
				<p>No food logs yet. Start by adding your first meal!</p>
			) : (
				<FoodLogsGroupedByDay foodLogs={foodLogs} onDelete={removeFoodLog} onEdit={onEditEntry} visibilityDays={7} />
			)}
		</article>
	);
}
