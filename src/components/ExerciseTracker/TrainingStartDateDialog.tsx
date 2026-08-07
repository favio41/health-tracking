import type { JSX } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { useSettings } from '@/context/settings';
import { localeISODate } from '@/utils';

export interface TrainingStartDateDialogProps {
	open: boolean;
	onClose: () => void;
}

export function TrainingStartDateDialog({ open, onClose }: TrainingStartDateDialogProps): JSX.Element {
	const dialogRef = useRef<HTMLDialogElement>(null);
	const { settings, updateSettings } = useSettings();

	const [date, setDate] = useState('');

	useEffect(() => {
		if (settings.trainingStartDate) {
			const isoString = localeISODate(settings.trainingStartDate).slice(0, 10);
			setDate(isoString);
		} else {
			const dt = new Date();
			const offset = dt.getTimezoneOffset() * 60000;
			const localDt = new Date(dt.getTime() - offset);
			const isoString = localDt.toISOString().slice(0, 10);
			setDate(isoString);
		}
	}, [open, settings.trainingStartDate]);

	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;

		if (open) {
			dialog.showModal();
		} else {
			dialog.close();
		}
	}, [open]);

	const handleSave = () => {
		if (!date) return;

		updateSettings({
			...settings,
			trainingStartDate: new Date(date),
		});
		onClose();
	};

	return (
		<dialog ref={dialogRef}>
			<article>
				<header>
					<button className="close" type="button" aria-label="Close" onClick={onClose}></button>
					<h2>Exercise setup</h2>
				</header>

				<fieldset>
					<div>
						<label>
							Start Date (first day of exercise)
							<input type="date" value={date} onInput={(e) => setDate((e.target as HTMLInputElement).value)} />
						</label>
					</div>
				</fieldset>

				<footer>
					<button type="button" onClick={onClose}>
						Cancel
					</button>
					<button type="button" onClick={handleSave}>
						Save
					</button>
				</footer>
			</article>
		</dialog>
	);
}
