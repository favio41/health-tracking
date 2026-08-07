import dayjs from 'dayjs';
import type { JSX } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { useTrainingDaysLog } from '@/context/trainingDaysLog';
import type { ScheduleGrid } from '@/types';
import { formatNumber } from '@/utils/formatNumber';

export interface DayDetailDialogProps {
	open: boolean;
	onClose: () => void;
	item: ScheduleGrid | null;
}

export function DayDetailDialog({ open, onClose, item }: DayDetailDialogProps): JSX.Element {
	const dialogRef = useRef<HTMLDialogElement>(null);
	const { trainingDaysLog, addTrainingDayLog, removeTrainingDayLog } = useTrainingDaysLog();

	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;

		if (open) {
			dialog.showModal();
		} else {
			dialog.close();
		}
	}, [open]);

	if (!item || item.status === 'BEFORE_START_DATE' || item.status === 'AFTER_END_DATE') {
		return <></>;
	}

	const isSkipped = item.status === 'SKIPPED';
	const skippedLog = trainingDaysLog.find(
		(log) => dayjs(log.datetime).isSame(item.date, 'day') && log.type === 'SKIPPED',
	);

	const handleSkipToggle = () => {
		if (isSkipped && skippedLog) {
			removeTrainingDayLog(skippedLog.id);
		} else {
			addTrainingDayLog({
				id: crypto.randomUUID(),
				datetime: item.date,
				type: 'SKIPPED',
			});
		}
		onClose();
	};

	return (
		<dialog ref={dialogRef}>
			<article>
				<header>
					<button className="close" type="button" aria-label="Close" onClick={onClose}></button>
					<h2>{dayjs(item.date).format('dddd, MMM DD, YYYY')}</h2>
				</header>

				<section>
					<div>
						<strong>Phase:</strong> <span style="text-transform:capitalize">{item.phase || 'N/A'}</span>
					</div>
					<div>
						<strong>Training:</strong> <span>{item.training ? `Week ${item.training}` : 'N/A'}</span>
					</div>
					<div>
						<strong>Nutrition:</strong> <span>{item.nutrition || 'N/A'}</span>
					</div>

					{item.macronutritionGoals && (
						<div>
							<strong>Macronutrient Goals:</strong>
							<ul style="margin-top: 0.5rem; margin-bottom: 0;">
								<li>Calories: {formatNumber(item.macronutritionGoals.calories, 0)}</li>
								<li>Protein: {formatNumber(item.macronutritionGoals.protein, 1)}g</li>
								<li>Fat: {formatNumber(item.macronutritionGoals.fat, 1)}g</li>
								<li>Carbs: {formatNumber(item.macronutritionGoals.carbs, 1)}g</li>
							</ul>
						</div>
					)}
				</section>

				<footer>
					<button type="button" onClick={onClose}>
						Close
					</button>
					<button type="button" onClick={handleSkipToggle}>
						{isSkipped ? 'Unskip' : 'Mark as Skipped'}
					</button>
				</footer>
			</article>
		</dialog>
	);
}
