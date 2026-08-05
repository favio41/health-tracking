import { useState } from 'preact/hooks';
import { hydrate, prerender as ssr } from 'preact-iso';
import './style.css';
import { FoodLogEntryDialog } from './components/FoodLogEntryDialog';
import { FoodLogsGroupedByDay } from './components/FoodLogsGroupedByDay';
import { ImportExportDialog } from './components/ImportExportDialog';
import { Navigation } from './components/Navigation';
import { FoodLogsProvider, useFoodLogs } from './context/foodLogs';
import { FoodsProvider } from './context/foods';

function AppContent() {
	const { foodLogs, addFoodLog, removeFoodLog } = useFoodLogs();
	const [foodLogEntryDialogOpen, setFoodLogEntryDialogOpen] = useState(false);
	const [importExportDialogOpen, setImportExportDialogOpen] = useState(false);

	return (
		<>
			<header>
				<Navigation
					setFoodLogEntryDialogOpen={setFoodLogEntryDialogOpen}
					setImportExportDialogOpen={setImportExportDialogOpen}
				/>
			</header>
			<main>
				{foodLogs.length === 0 ? (
					<p>No food logs yet. Start by adding your first meal!</p>
				) : (
					<FoodLogsGroupedByDay foodLogs={foodLogs} onDelete={removeFoodLog} />
				)}
				<FoodLogEntryDialog
					open={foodLogEntryDialogOpen}
					onSave={addFoodLog}
					onClose={() => setFoodLogEntryDialogOpen(false)}
				/>
				<ImportExportDialog open={importExportDialogOpen} onClose={() => setImportExportDialogOpen(false)} />
			</main>
		</>
	);
}

export function App() {
	return (
		<FoodsProvider>
			<FoodLogsProvider>
				<AppContent />
			</FoodLogsProvider>
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
