import { useEffect, useState } from 'preact/hooks';
import { useSettings } from '@/context/settings';
import { useTrainingScheduleBaseline } from '@/context/training-schedule-baseline';
import { trainingAndMacronutritionSchedule } from '@/models/trainingAndMacronutritionSchedule';
import './MonthlyGrid.css';
import dayjs from 'dayjs';
import type { ScheduleGrid } from '@/types';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function MonthlyGrid() {
	const { settings } = useSettings();
	const trainingScheduleBaseline = useTrainingScheduleBaseline();
	const [trainingSchedule, setTrainingSchedule] = useState<ScheduleGrid[]>([]);
	// const [schedule, setSchedule] = useState<string[]>([]);

	useEffect(() => {
		if (settings.trainingStartDate && trainingScheduleBaseline) {
			const grid = trainingAndMacronutritionSchedule({
				settings,
				trainingDayLog: [{ id: '1', datetime: new Date('2026-07-31'), type: 'SKIPPED' as const }],
				trainingScheduleBaseline,
			});
			setTrainingSchedule(grid);
			// const stringified = Object.values(grid).map((scheduleGrid) => JSON.stringify(scheduleGrid, null, 2));
			// setSchedule(stringified);
		}
	}, [settings.trainingStartDate, trainingScheduleBaseline]);

	return (
		<div class="week-grid">
			{DAYS_OF_WEEK.map((day) => (
				<div key={day} class="week-grid-header">
					{day}
				</div>
			))}
			{trainingSchedule.length > 0 &&
				trainingSchedule.map((item, index) => (
					<div
						key={index}
						className={`week-grid-cell ${item.status} ${item.training ?? ''} ${dayjs(item.date).isSame(dayjs(), 'day') ? 'TODAY' : ''}`}
					>
						<small class="phase" style="text-transform:capitalize">
							{dayjs(item.date).format('ddd, MMM DD')}
						</small>
						<Cell item={item}></Cell>
					</div>
				))}
		</div>
	);
}

function Cell({ item }: { item: ScheduleGrid }) {
	if (item.status === 'BEFORE_START_DATE' || item.status === 'AFTER_END_DATE') {
		return;
	}

	if (item.status === 'SKIPPED') {
		return (
			<div className={item.phase}>
				<small class="phase">{item.phase}</small>
				<p>Skipped</p>
			</div>
		);
	}

	return (
		<div className={item.phase}>
			<small class="phase">{item.phase}</small>
			{item.training && item.training !== 'OFF' && item.training !== 'CARDIO' && <p>workout #{item.training}</p>}
			{(item.training === 'OFF' || item.training === 'CARDIO') && <p>{item.training}</p>}
		</div>
	);
}
