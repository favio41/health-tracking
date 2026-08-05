import type { JSX } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { useFoods } from '@/context/foods';
import { FoodLogModel } from '@/models/foodLog';
import type { Food, FoodLog, Unit } from '@/types';
import { localeISODate } from '@/utils';

export interface FoodLogEntryDialogProps {
	open: boolean;
	entry?: FoodLog;
	onSave: (entry: FoodLog) => void;
	onClose: () => void;
}

export function FoodLogEntryDialog({ open, entry, onSave, onClose }: FoodLogEntryDialogProps): JSX.Element {
	const dialogRef = useRef<HTMLDialogElement>(null);
	const foods = useFoods();

	const [datetime, setDatetime] = useState('');
	const [query, setQuery] = useState('');
	const [selectedFood, setSelectedFood] = useState<Food | null>(null);
	const [amount, setAmount] = useState(100);
	const [unit, setUnit] = useState<Unit>('g');

	useEffect(() => {
		if (entry) {
			const dt = new Date(entry.datetime);
			const isoString = localeISODate(dt).slice(0, 16);
			setDatetime(isoString);
			setSelectedFood(entry.food);
			setAmount(entry.amount.amount);
			setUnit(entry.amount.unit);
			setQuery('');
		} else {
			const dt = new Date();
			const offset = dt.getTimezoneOffset() * 60000;
			const localDt = new Date(dt.getTime() - offset);
			const isoString = localDt.toISOString().slice(0, 16);
			setDatetime(isoString);
			setSelectedFood(null);
			setAmount(100);
			setUnit('g');
			setQuery('');
		}
	}, [open, entry]);

	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;

		if (open) {
			dialog.showModal();
		} else {
			dialog.close();
		}
	}, [open]);

	const matches =
		query.trim() && !selectedFood
			? foods
					.filter((f) => {
						const foodNameLower = f.name.toLowerCase();
						const keywords = query.toLowerCase().split(/\s+/);
						return keywords.every((keyword) => foodNameLower.includes(keyword));
					})
					.slice(0, 20)
			: [];

	const handleSave = () => {
		if (!selectedFood || amount <= 0) return;

		const log = FoodLogModel(new Date(datetime), selectedFood, { unit, amount });
		onSave(log);
		onClose();
	};

	return (
		<dialog ref={dialogRef}>
			<article>
				<header>
					<button className="close" type="button" aria-label="Close" onClick={onClose}></button>
					<h2>{entry ? 'Edit Food' : 'Log Food'}</h2>
				</header>

				<fieldset>
					<div>
						<label>
							Date & Time
							<input
								type="datetime-local"
								value={datetime}
								onInput={(e) => setDatetime((e.target as HTMLInputElement).value)}
							/>
						</label>
					</div>

					<div>
						<label>
							Food Item
							<input
								type="text"
								value={selectedFood ? selectedFood.name : query}
								placeholder="Search for food..."
								onInput={(e) => {
									if (!selectedFood) {
										setQuery((e.target as HTMLInputElement).value);
									}
								}}
								readOnly={!!selectedFood}
							/>
						</label>
						{matches.length > 0 && (
							<ul style="border: 1px solid; border-radius: 4px; max-height: 200px; overflow-y: auto; list-style: none; padding: 0; margin-top: 0.5rem;">
								{matches.map((food) => (
									<li key={food.id} style="padding: 0; border-bottom: 1px solid #ccc;">
										<button
											type="button"
											style="width: 100%; padding: 0.5rem; text-align: left; border: none; background: none; cursor: pointer;"
											onClick={() => {
												setSelectedFood(food);
												setQuery('');
											}}
											onKeyDown={(e) => {
												if (e.key === 'Enter' || e.key === ' ') {
													e.preventDefault();
													setSelectedFood(food);
													setQuery('');
												}
											}}
										>
											<span>
												{food.name} (P:{food.protein}, F:{food.fat}, C:{food.carbs})
											</span>
										</button>
									</li>
								))}
							</ul>
						)}
						{selectedFood && (
							<p style="margin-top: 0.5rem;">
								Selected: <strong>{selectedFood.name}</strong>
								<button
									type="button"
									onClick={() => {
										setSelectedFood(null);
										setQuery('');
									}}
								>
									Change
								</button>
							</p>
						)}
					</div>

					<div>
						<label>
							Amount
							<input
								type="number"
								value={amount}
								onInput={(e) => setAmount((e.target as HTMLInputElement).valueAsNumber)}
								min="1"
							/>
						</label>
					</div>

					<div>
						<label>
							Unit
							<select value={unit} onChange={(e) => setUnit((e.target as HTMLSelectElement).value as Unit)}>
								<option value="g">g</option>
								<option value="ml">ml</option>
								<option value="oz">oz</option>
								<option value="cup">cup</option>
								<option value="serving">serving</option>
							</select>
						</label>
					</div>
				</fieldset>

				<footer>
					<button type="button" onClick={onClose}>
						Cancel
					</button>
					<button type="button" onClick={handleSave}>
						{entry ? 'Save Changes' : 'Add Entry'}
					</button>
				</footer>
			</article>
		</dialog>
	);
}
