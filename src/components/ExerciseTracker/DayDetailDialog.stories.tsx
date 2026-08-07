import type { Meta, StoryObj } from '@storybook/preact-vite';
import type { JSX } from 'preact';
import { TrainingDaysLogProvider } from '@/context/trainingDaysLog';
import { DayDetailDialog } from './DayDetailDialog';
import type { ScheduleGrid } from '@/types';

const meta = {
	title: 'Components/ExerciseTracker/DayDetailDialog',
	component: DayDetailDialog,
	decorators: [
		(Story): JSX.Element => (
			<TrainingDaysLogProvider>
				<Story />
			</TrainingDaysLogProvider>
		),
	],
} satisfies Meta<typeof DayDetailDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleOkDay: ScheduleGrid = {
	date: new Date('2026-08-10'),
	phase: 'prime',
	status: 'OK',
	training: '1',
	nutrition: '16/8',
	macronutritionGoals: {
		calories: 2500,
		protein: 200,
		fat: 83,
		carbs: 250,
	},
};

const sampleSkippedDay: ScheduleGrid = {
	date: new Date('2026-08-11'),
	phase: 'prime',
	status: 'SKIPPED',
	training: undefined,
	nutrition: '16/8',
	macronutritionGoals: {
		calories: 2000,
		protein: 160,
		fat: 67,
		carbs: 200,
	},
};

const sampleCardioDay: ScheduleGrid = {
	date: new Date('2026-08-12'),
	phase: 'adapt',
	status: 'OK',
	training: 'CARDIO',
	nutrition: 'CHEAT_DAY',
	macronutritionGoals: null,
};

export const OkDay: Story = {
	args: {
		open: true,
		item: sampleOkDay,
		onClose: () => console.log('closed'),
	},
};

export const SkippedDay: Story = {
	args: {
		open: true,
		item: sampleSkippedDay,
		onClose: () => console.log('closed'),
	},
};

export const CardioDay: Story = {
	args: {
		open: true,
		item: sampleCardioDay,
		onClose: () => console.log('closed'),
	},
};

export const Closed: Story = {
	args: {
		open: false,
		item: sampleOkDay,
		onClose: () => console.log('closed'),
	},
};

export const NullItem: Story = {
	args: {
		open: true,
		item: null,
		onClose: () => console.log('closed'),
	},
};
