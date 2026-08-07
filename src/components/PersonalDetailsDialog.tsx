import { User } from 'lucide-preact';
import type { JSX } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { useSettings } from '@/context/settings';

export interface PersonalDetailsDialogProps {
	open: boolean;
	onClose: () => void;
}

export function PersonalDetailsDialog({ open, onClose }: PersonalDetailsDialogProps): JSX.Element {
	const dialogRef = useRef<HTMLDialogElement>(null);
	const { settings, updateSettings } = useSettings();

	const [weight, setWeight] = useState('');
	const [bodyFat, setBodyFat] = useState('');

	useEffect(() => {
		if (open) {
			setWeight(settings.weightKg?.toString() ?? '');
			setBodyFat(settings.bodyFatPercentage?.toString() ?? '');
		}
	}, [open, settings]);

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
		const newSettings = { ...settings };
		if (weight) {
			newSettings.weightKg = parseFloat(weight);
		}
		if (bodyFat) {
			newSettings.bodyFatPercentage = parseFloat(bodyFat);
		}
		updateSettings(newSettings);
		onClose();
	};

	return (
		<dialog ref={dialogRef} onCancel={onClose}>
			<article>
				<header>
					<button className="close" type="button" aria-label="Close" onClick={onClose}></button>
					<h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 0 }}>
						<User size={20} />
						Personal Details
					</h2>
				</header>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						handleSave();
					}}
				>
					<fieldset>
						<label>
							Weight (kg)
							<input
								type="number"
								step="0.1"
								placeholder="Enter your weight"
								value={weight}
								onInput={(e) => setWeight((e.target as HTMLInputElement).value)}
							/>
						</label>
						<label>
							Body Fat (%)
							<input
								type="number"
								step="0.1"
								placeholder="Enter your body fat percentage"
								value={bodyFat}
								onInput={(e) => setBodyFat((e.target as HTMLInputElement).value)}
							/>
						</label>
					</fieldset>
					<footer>
						<button type="button" onClick={onClose}>
							Cancel
						</button>
						<button type="submit">Save</button>
					</footer>
				</form>
			</article>
		</dialog>
	);
}
