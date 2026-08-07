import { CalendarCog } from 'lucide-preact';
import { useEffect, useState } from 'preact/hooks';
import { useSettings } from '@/context/settings';
import { MonthlyGrid } from './MonthlyGrid';
import { TrainingStartDateDialog } from './TrainingStartDateDialog';

interface ExerciseTrackerProps {
	onAddEntry: () => void;
}

export function ExerciseTracker({ onAddEntry }: ExerciseTrackerProps) {
	const { settings } = useSettings();
	const [isDateDialogOpen, setIsDateDialogOpen] = useState(false);
	const [showGrid, setShowGrid] = useState(true);

	useEffect(() => {
		setShowGrid(!!settings.trainingStartDate);
	}, ['settings']);

	return (
		<article>
			<nav>
				<ul>
					<li>
						<h2>Exercise Tracker</h2>
					</li>
				</ul>
				<ul>
					<li>
						<button type="button" onClick={onAddEntry}>
							Add Exercise Entry
						</button>
					</li>
					<li>
						<button type="button" onClick={() => setIsDateDialogOpen(true)}>
							<CalendarCog />
						</button>
					</li>
				</ul>
			</nav>
			{showGrid ? (
				<ShowMonthlyGrid settings={settings} />
			) : (
				<TrainingDayStartDateEmptyNotice setIsDateDialogOpen={setIsDateDialogOpen} />
			)}
			<TrainingStartDateDialog open={isDateDialogOpen} onClose={() => setIsDateDialogOpen(false)} />
		</article>
	);
}

function ShowMonthlyGrid({ settings }: { settings: { trainingStartDate?: Date } }) {
	return (
		<div>
			<p>Training started on {settings.trainingStartDate?.toLocaleDateString()}</p>
			<MonthlyGrid />
		</div>
	);
}

function TrainingDayStartDateEmptyNotice({ setIsDateDialogOpen }: { setIsDateDialogOpen: (value: boolean) => void }) {
	return (
		<div className="text-center my-20">
			<p>No training start date set. Configure your settings to begin tracking!</p>
			<button type="button" onClick={() => setIsDateDialogOpen(true)}>
				Set Training Start Date
			</button>
		</div>
	);
}
