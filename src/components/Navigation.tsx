export interface HeaderProps {
	setImportExportDialogOpen: (open: boolean) => void;
}

export function Navigation({ setImportExportDialogOpen }: HeaderProps) {
	return (
		<nav>
			<ul>
				<li>
					<h1>
						<strong>Alpha Men's toolbox app</strong>
					</h1>
				</li>
			</ul>
			<ul>
				<li>
					<button type="button" class="secondary" onClick={() => setImportExportDialogOpen(true)}>
						Export/Import Log
					</button>
				</li>
			</ul>
		</nav>
	);
}
