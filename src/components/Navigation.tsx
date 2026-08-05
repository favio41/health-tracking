import type { Dispatch, StateUpdater } from 'preact/hooks';

export interface HeaderProps {
	setFoodLogEntryDialogOpen: Dispatch<StateUpdater<boolean>>;
	setImportExportDialogOpen: Dispatch<StateUpdater<boolean>>;
}

export function Navigation({ setFoodLogEntryDialogOpen, setImportExportDialogOpen }: HeaderProps) {
	return (
		<nav>
			<ul>
				<li>
					<h1>
						<strong>Food Tracker</strong>
					</h1>
				</li>
			</ul>
			<ul>
				<li>
					<button type="button" onClick={() => setFoodLogEntryDialogOpen(true)}>
						Add Entry
					</button>
				</li>
				<li>
					<button type="button" class="secondary" onClick={() => setImportExportDialogOpen(true)}>
						Export/Import Log
					</button>
				</li>
			</ul>
		</nav>
	);
}
