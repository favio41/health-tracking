import dayjs, { type Dayjs } from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import utc from 'dayjs/plugin/utc';
import type {
	MacronutrientGoals,
	NutritionOptions,
	Phases,
	ScheduleGrid,
	Settings,
	TrainingDayLog,
	TrainingOptions,
	TrainingScheduleBaseline,
	TrainingWeeks,
} from '@/types';
import trainingScheduleBaselineRaw from '../../public/training-schedule.json';
import { getMacronutrientGoals } from './macronutrientGoals';

const trainingScheduleBaselineSource = trainingScheduleBaselineRaw as TrainingScheduleBaseline;

interface TrainingAndMacronutritionOnDayInput {
	settings: Settings;
	trainingDayLog: TrainingDayLog[];
	date?: Date | Dayjs;
	trainingScheduleBaseline?: TrainingScheduleBaseline;
	macronutrientGoals?: MacronutrientGoals;
}

dayjs.extend(utc);
dayjs.extend(isoWeek);

export function trainingAndMacronutritionSchedule({
	date = new Date(),
	...args
}: TrainingAndMacronutritionOnDayInput): ScheduleGrid[] {
	const mondayThisWeek = dayjs(date).utc().startOf('isoWeek');
	const gridSize = 7 * 5;

	let dateIndex = dayjs(mondayThisWeek);
	const result: ScheduleGrid[] = [];

	for (let index = 0; index < gridSize; index++) {
		result.push(
			trainingAndMacronutritionOnDay({
				date: dateIndex,
				...args,
			}),
		);

		dateIndex = dateIndex.add(1, 'day');
	}

	return result;
}

export function trainingAndMacronutritionOnDay({
	settings,
	trainingDayLog,
	date,
	trainingScheduleBaseline,
	macronutrientGoals: replacementMacronutrientGoals,
}: TrainingAndMacronutritionOnDayInput): ScheduleGrid {
	const selectedDate = dayjs(date);
	const { trainingStartDate } = settings;
	const macronutrientGoals = replacementMacronutrientGoals || getMacronutrientGoals(settings);
	const linearBaseline = getLinearBaseline(trainingScheduleBaseline || trainingScheduleBaselineSource);
	let status: ScheduleGrid['status'];
	const skippedDays = getSkippedDatesInRange(trainingDayLog, dayjs(trainingStartDate).utc(), selectedDate.utc());
	const daysCount = selectedDate.diff(trainingStartDate, 'days') - skippedDays.length;
	const baseline: LinearBaseline | null = linearBaseline[daysCount];

	const skippedDates: Dayjs[] = getSkippedDates(trainingDayLog);

	if (selectedDate.isBefore(trainingStartDate)) {
		status = 'BEFORE_START_DATE';
	} else if (daysCount > linearBaseline.length) {
		status = 'AFTER_END_DATE';
	} else if (skippedDates.some((d) => d.isSame(date, 'day'))) {
		status = 'SKIPPED';
		const skippedIndex = skippedDates.findIndex((d) => d.isSame(date, 'day'));
		skippedDates.splice(skippedIndex, 1);
	} else {
		status = 'OK';
	}

	return {
		date: selectedDate.toDate(),
		phase: baseline?.phase,
		status,
		training: status === 'OK' ? baseline?.training : undefined,
		nutrition: baseline?.nutrition ?? '16/8',
		macronutritionGoals: getMacronutrientGoalForTheDay(status, baseline, macronutrientGoals),
	};
}

function getMacronutrientGoalForTheDay(
	status: ScheduleGrid['status'],
	baseline: LinearBaseline | null,
	macronutrientGoals: MacronutrientGoals | null,
) {
	if (!macronutrientGoals || !baseline?.phase) return null;
	if (['FULL_FAST', 'CHEAT_DAY'].includes(baseline.nutrition)) {
		return null;
	}
	const goalInPhase = macronutrientGoals[baseline.phase];
	const goalInWeek = goalInPhase.all ?? goalInPhase[baseline.week];
	switch (status) {
		case 'OK':
			return goalInWeek.workout;
		case 'BEFORE_START_DATE':
		case 'AFTER_END_DATE':
			return null;
		case 'SKIPPED':
			return goalInWeek.nonWorkout;
		default:
			throw new Error(`Unknown status: ${status}`);
	}
}

interface LinearBaseline {
	phase: Phases;
	training: TrainingOptions;
	nutrition: NutritionOptions;
	week: TrainingWeeks;
}

export function getLinearBaseline(trainingScheduleBaseline?: TrainingScheduleBaseline): LinearBaseline[] {
	const sequencePhases: Phases[] = ['prime', 'adapt', 'surge', 'complete'];
	return sequencePhases.flatMap((phase: Phases) => {
		const { training, nutrition } = (trainingScheduleBaseline || trainingScheduleBaselineSource)[phase];
		const result: LinearBaseline[] = training.map((t, index) => ({
			phase,
			training: t,
			nutrition: nutrition?.[index] ?? '16/8',
			week: `week${Math.floor(index / 7) + 1}` as TrainingWeeks,
		}));
		return result;
	});
}

export function getSkippedDates(trainingDayLog: TrainingDayLog[]): Dayjs[] {
	return trainingDayLog
		.filter((log) => log.type === 'SKIPPED')
		.map((log) => dayjs(log.datetime))
		.sort((a, b) => a.diff(b));
}

export function getSkippedDatesInRange(trainingDayLog: TrainingDayLog[], from: Dayjs, to: Dayjs): Dayjs[] {
	return getSkippedDates(trainingDayLog).filter(
		(date) =>
			date.isSame(from, 'day') || date.isSame(to, 'date') || (date.isAfter(from, 'day') && date.isBefore(to, 'day')),
	);
}
