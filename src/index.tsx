import { useState } from 'preact/hooks';
import { hydrate, prerender as ssr } from 'preact-iso';
import './style.css';
import { ExerciseTracker } from '@/components/ExerciseTracker';
import { FoodTracker } from '@/components/FoodTracker';
import { FoodLogEntryDialog } from '@/components/FoodTracker/FoodLogEntryDialog';
import { ImportExportDialog } from '@/components/ImportExportDialog';
import { Navigation } from '@/components/Navigation';
import { PersonalDetailsDialog } from '@/components/PersonalDetailsDialog';
import { FoodLogsProvider, useFoodLogs } from '@/context/foodLogs';
import { FoodsProvider } from '@/context/foods';
import { SettingsProvider } from '@/context/settings';
import { TrainingScheduleBaselineProvider } from '@/context/training-schedule-baseline';
import { TrainingDaysLogProvider } from '@/context/trainingDaysLog';
import type { FoodLog } from '@/types';

function AppContent() {
	const { addFoodLog, updateFoodLog } = useFoodLogs();
	const [foodLogEntryDialogOpen, setFoodLogEntryDialogOpen] = useState(false);
	const [importExportDialogOpen, setImportExportDialogOpen] = useState(false);
	const [personalDetailsDialogOpen, setPersonalDetailsDialogOpen] = useState(false);
	const [editingEntry, setEditingEntry] = useState<FoodLog | undefined>(undefined);

	function Dialogs() {
		return (
			<>
				<FoodLogEntryDialog
					open={foodLogEntryDialogOpen}
					entry={editingEntry}
					onSave={(log) => {
						if (editingEntry) {
							updateFoodLog({ ...log, id: editingEntry.id });
						} else {
							addFoodLog(log);
						}
					}}
					onClose={() => {
						setFoodLogEntryDialogOpen(false);
						setEditingEntry(undefined);
					}}
				/>
				<ImportExportDialog open={importExportDialogOpen} onClose={() => setImportExportDialogOpen(false)} />
				<PersonalDetailsDialog open={personalDetailsDialogOpen} onClose={() => setPersonalDetailsDialogOpen(false)} />
			</>
		);
	}

	return (
		<>
			<header>
				<Navigation setImportExportDialogOpen={setImportExportDialogOpen} />
			</header>
			<main>
				<FoodTracker
					onAddEntry={() => {
						setEditingEntry(undefined);
						setFoodLogEntryDialogOpen(true);
					}}
					onEditEntry={(entry) => {
						setEditingEntry(entry);
						setFoodLogEntryDialogOpen(true);
					}}
					onOpenPersonalDetails={() => setPersonalDetailsDialogOpen(true)}
				/>
				<ExerciseTracker onAddEntry={() => {}} />
				<Dialogs />
			</main>
		</>
	);
}

export function App() {
	return (
		<FoodsProvider>
			<TrainingScheduleBaselineProvider>
				<SettingsProvider>
					<TrainingDaysLogProvider>
						<FoodLogsProvider>
							<AppContent />
						</FoodLogsProvider>
					</TrainingDaysLogProvider>
				</SettingsProvider>
			</TrainingScheduleBaselineProvider>
		</FoodsProvider>
	);
}

if (typeof window !== 'undefined') {
	const app = document.getElementById('app');
	if (app) {
		hydrate(<App />, app);
	}
}

export async function prerender(data: Record<string, unknown>) {
	return await ssr(<App {...data} />);
}
