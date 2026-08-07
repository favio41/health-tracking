import type { JSX } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import type { TrainingDayLog } from '@/types';
import { localeISODate } from '@/utils';
import { useFoodLogs } from '../context/foodLogs';
import { useSettings } from '../context/settings';
import { useTrainingDaysLog } from '../context/trainingDaysLog';

export interface ImportExportDialogProps {
	open: boolean;
	onClose: () => void;
}

export function ImportExportDialog({ open, onClose }: ImportExportDialogProps): JSX.Element {
	const dialogRef = useRef<HTMLDialogElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const { foodLogs, importFoodLogBatch } = useFoodLogs();
	const { settings, updateSettings } = useSettings();
	const { trainingDaysLog, addTrainingDayLog } = useTrainingDaysLog();
	const [importStatus, setImportStatus] = useState<string>('');

	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;

		if (open) {
			dialog.showModal();
		} else {
			dialog.close();
		}
	}, [open]);

	const handleDownload = () => {
		const dataStr = JSON.stringify({ foodLogs, settings, trainingDaysLog }, null, 2);
		const dataBlob = new Blob([dataStr], { type: 'application/json' });
		const url = URL.createObjectURL(dataBlob);
		const link = document.createElement('a');
		link.href = url;
		link.download = `men2_0-app-export-${localeISODate().slice(0, 16)}.json`;
		link.click();
		URL.revokeObjectURL(url);
	};

	const handleUploadClick = () => {
		fileInputRef.current?.click();
	};

	const handleFileSelect = (e: Event) => {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = (event) => {
			try {
				const content = event.target?.result as string;
				const data = JSON.parse(content);
				if (typeof data !== 'object' || data === null) {
					throw new Error('Invalid format: expected an object');
				}
				if (!Array.isArray(data.foodLogs)) {
					throw new Error('Invalid format: expected an array of food logs');
				}
				const { imported, failed } = importFoodLogBatch(data.foodLogs);
				let message = `Imported ${imported} food logs${failed > 0 ? ` (${failed} failed)` : ''}`;

				if (data.settings && typeof data.settings === 'object') {
					updateSettings(data.settings);
					message += ', settings restored';
				}

				if (Array.isArray(data.trainingDaysLog)) {
					data.trainingDaysLog.forEach((log: unknown) => {
						addTrainingDayLog(log as TrainingDayLog);
					});
					message += `, ${data.trainingDaysLog.length} training logs restored`;
				}

				setImportStatus(message);
				setTimeout(() => {
					setImportStatus('');
					onClose();
				}, 2000);
			} catch (err) {
				const errorMsg = err instanceof Error ? err.message : 'Unknown error';
				setImportStatus(`Error: ${errorMsg}`);
			}
		};
		reader.readAsText(file);
		// Reset file input
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	};

	return (
		<dialog ref={dialogRef}>
			<article>
				<header>
					<button className="close" type="button" aria-label="Close" onClick={onClose}></button>
					<h2>Export/Import Data</h2>
				</header>

				<fieldset>
					<div style="display: flex; flex-direction: column; gap: 1rem;">
						<div>
							<h3>Export</h3>
							<p>Download your food logs, settings, and training data as a JSON file.</p>
							<button type="button" onClick={handleDownload} style="width: 100%;">
								Download JSON
							</button>
						</div>

						<hr />

						<div>
							<h3>Import</h3>
							<p>Upload a previously exported JSON file to restore your food logs, settings, and training data.</p>
							<button type="button" onClick={handleUploadClick} class="secondary" style="width: 100%;">
								Upload JSON
							</button>
							<input ref={fileInputRef} type="file" accept=".json" onChange={handleFileSelect} style="display: none;" />
						</div>

						{importStatus && (
							<p style="color: #28a745; font-weight: bold;">
								{importStatus.startsWith('Error') ? 'Error: ' : ''}
								{importStatus}
							</p>
						)}
					</div>
				</fieldset>

				<footer>
					<button type="button" onClick={onClose}>
						Close
					</button>
				</footer>
			</article>
		</dialog>
	);
}
