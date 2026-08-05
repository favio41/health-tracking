export interface HeaderProps {
	onAddEntry: () => void;
	setImportExportDialogOpen: (open: boolean) => void;
}

export function Navigation({ onAddEntry, setImportExportDialogOpen }: HeaderProps) {
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
					<button type="button" onClick={onAddEntry}>
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
