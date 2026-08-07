import { useEffect, useState } from 'preact/hooks';
import { useSettings } from '@/context/settings';
import { useTrainingScheduleBaseline } from '@/context/training-schedule-baseline';
import { useTrainingDaysLog } from '@/context/trainingDaysLog';
import { trainingAndMacronutritionSchedule } from '@/models/trainingAndMacronutritionSchedule';
import { DayDetailDialog } from './DayDetailDialog';
import './MonthlyGrid.css';
import dayjs from 'dayjs';
import type { ScheduleGrid } from '@/types';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function MonthlyGrid() {
	const { settings } = useSettings();
	const { trainingDaysLog } = useTrainingDaysLog();
	const trainingScheduleBaseline = useTrainingScheduleBaseline();
	const [trainingSchedule, setTrainingSchedule] = useState<ScheduleGrid[]>([]);
	const [selectedItem, setSelectedItem] = useState<ScheduleGrid | null>(null);

	useEffect(() => {
		if (settings.trainingStartDate && trainingScheduleBaseline) {
			const grid = trainingAndMacronutritionSchedule({
				settings,
				trainingDayLog: trainingDaysLog,
				trainingScheduleBaseline,
			});
			setTrainingSchedule(grid);
		}
	}, [settings.trainingStartDate, trainingScheduleBaseline, trainingDaysLog]);

	return (
		<>
			<div className="week-grid">
				{DAYS_OF_WEEK.map((day) => (
					<div key={day} className="week-grid-header">
						{day}
					</div>
				))}
				{trainingSchedule.length > 0 &&
					trainingSchedule.map((item, index) => (
						<button
							key={index}
							type="button"
							className={`week-grid-cell ${item.status} ${item.training ?? ''} ${dayjs(item.date).isSame(dayjs(), 'day') ? 'TODAY' : ''}`}
							onClick={() => {
								if (item.status !== 'BEFORE_START_DATE' && item.status !== 'AFTER_END_DATE') {
									setSelectedItem(item);
								}
							}}
						>
							<small className="phase" style="text-transform:capitalize">
								{dayjs(item.date).format('ddd, MMM DD')}
							</small>
							<Cell item={item}></Cell>
						</button>
					))}
			</div>
			<DayDetailDialog open={selectedItem !== null} item={selectedItem} onClose={() => setSelectedItem(null)} />
		</>
	);
}

function Cell({ item }: { item: ScheduleGrid }) {
	if (item.status === 'BEFORE_START_DATE' || item.status === 'AFTER_END_DATE') {
		return;
	}

	if (item.status === 'SKIPPED') {
		return (
			<div className={item.phase}>
				<small className="phase">{item.phase}</small>
				<p>Skipped</p>
			</div>
		);
	}

	return (
		<div className={item.phase}>
			<small className="phase">{item.phase}</small>
			{item.training && item.training !== 'OFF' && item.training !== 'CARDIO' && <p>workout #{item.training}</p>}
			{(item.training === 'OFF' || item.training === 'CARDIO') && <p>{item.training}</p>}
		</div>
	);
}
