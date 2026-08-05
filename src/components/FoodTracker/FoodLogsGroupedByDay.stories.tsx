import type { Meta, StoryObj } from '@storybook/preact-vite';
import { FoodLogModel } from '@/models/foodLog';
import { FoodLogsGroupedByDay } from './FoodLogsGroupedByDay';

const meta = {
	title: 'Components/FoodLogsGroupedByDay',
	component: FoodLogsGroupedByDay,
} satisfies Meta<typeof FoodLogsGroupedByDay>;

export default meta;
type Story = StoryObj<typeof meta>;

const chickenFood = {
	source: 'USDA' as const,
	id: 'chicken-breast',
	name: 'Chicken breast',
	calories: 165,
	protein: 31,
	fat: 3.6,
	carbs: 0,
};

const riceFood = {
	source: 'USDA' as const,
	id: 'white-rice',
	name: 'White rice',
	calories: 130,
	protein: 2.7,
	fat: 0.3,
	carbs: 28,
};

export const Default: Story = {
	args: {
		foodLogs: [
			FoodLogModel(new Date('2026-08-03T08:30:00Z'), chickenFood, { unit: 'g', amount: 150 }),
			FoodLogModel(new Date('2026-08-03T12:00:00Z'), riceFood, { unit: 'g', amount: 151 }),
			FoodLogModel(new Date('2026-08-03T18:30:00Z'), chickenFood, { unit: 'g', amount: 120 }),
			FoodLogModel(new Date('2026-08-02T08:00:00Z'), riceFood, { unit: 'ml', amount: 200 }),
			FoodLogModel(new Date('2026-08-02T13:30:00Z'), chickenFood, { unit: 'cup', amount: 1 }),
			FoodLogModel(new Date('2026-08-01T19:00:00Z'), riceFood, { unit: 'oz', amount: 5 }),
		],
		onDelete: () => {},
		onEdit: () => {},
		visibilityDays: 2,
	},
};

export const SingleDay: Story = {
	args: {
		foodLogs: [
			FoodLogModel(new Date('2026-08-03T08:00:00Z'), chickenFood, { unit: 'g', amount: 150 }),
			FoodLogModel(new Date('2026-08-03T12:30:00Z'), riceFood, { unit: 'ml', amount: 300 }),
			FoodLogModel(new Date('2026-08-03T19:00:00Z'), chickenFood, { unit: 'g', amount: 100 }),
		],
		onDelete: () => {},
		onEdit: () => {},
		visibilityDays: 2,
	},
};

export const Empty: Story = {
	args: {
		foodLogs: [],
		onDelete: () => {},
		onEdit: () => {},
		visibilityDays: 2,
	},
};

export const ManyDays: Story = {
	args: {
		foodLogs: [
			FoodLogModel(new Date('2026-08-05T08:30:00Z'), chickenFood, { unit: 'g', amount: 150 }),
			FoodLogModel(new Date('2026-08-05T12:00:00Z'), riceFood, { unit: 'g', amount: 151 }),
			FoodLogModel(new Date('2026-08-04T08:00:00Z'), chickenFood, { unit: 'g', amount: 150 }),
			FoodLogModel(new Date('2026-08-04T12:30:00Z'), riceFood, { unit: 'ml', amount: 300 }),
			FoodLogModel(new Date('2026-08-03T08:30:00Z'), chickenFood, { unit: 'g', amount: 150 }),
			FoodLogModel(new Date('2026-08-03T12:00:00Z'), riceFood, { unit: 'g', amount: 151 }),
			FoodLogModel(new Date('2026-08-03T18:30:00Z'), chickenFood, { unit: 'g', amount: 120 }),
			FoodLogModel(new Date('2026-08-02T08:00:00Z'), riceFood, { unit: 'ml', amount: 200 }),
			FoodLogModel(new Date('2026-08-02T13:30:00Z'), chickenFood, { unit: 'cup', amount: 1 }),
			FoodLogModel(new Date('2026-08-01T19:00:00Z'), riceFood, { unit: 'oz', amount: 5 }),
		],
		onDelete: () => {},
		onEdit: () => {},
		visibilityDays: 2,
	},
};
