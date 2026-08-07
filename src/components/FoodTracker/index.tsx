import { User } from 'lucide-preact';
import { useFoodLogs } from '@/context/foodLogs';
import type { FoodLog } from '@/types';
import { FoodLogsGroupedByDay } from './FoodLogsGroupedByDay';

interface FoodTrackerProps {
	onAddEntry: () => void;
	onEditEntry: (entry: FoodLog) => void;
	onOpenPersonalDetails: () => void;
}

export function FoodTracker({ onAddEntry, onEditEntry, onOpenPersonalDetails }: FoodTrackerProps) {
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
					<li>
						<button
							type="button"
							onClick={onOpenPersonalDetails}
							style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
						>
							<User size={18} />
							Personal Details
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
