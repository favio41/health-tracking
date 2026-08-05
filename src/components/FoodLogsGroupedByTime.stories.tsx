import type { Meta, StoryObj } from '@storybook/preact-vite';
import { FoodLogModel } from '../models/foodLog';
import { FoodLogsGroupedByTime } from './FoodLogsGroupedByTime';

const meta = {
	title: 'Components/FoodLogsGroupedByTime',
	component: FoodLogsGroupedByTime,
	render: (args) => (
		<table>
			<thead>
				<tr>
					<th style="width: 24px;"></th>
					<th>Time</th>
					<th>Food</th>
					<th>Amount</th>
					<th>Calories</th>
					<th>Protein</th>
					<th>Fat</th>
					<th>Carbs</th>
				</tr>
			</thead>
			<tbody>
				<FoodLogsGroupedByTime {...args} />
			</tbody>
		</table>
	),
} satisfies Meta<typeof FoodLogsGroupedByTime>;

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
			FoodLogModel(new Date('2026-08-03T08:30:00Z'), riceFood, { unit: 'g', amount: 151 }),
			FoodLogModel(new Date('2026-08-03T11:30:00Z'), riceFood, { unit: 'ml', amount: 200 }),
			FoodLogModel(new Date('2026-08-03T13:00:00Z'), chickenFood, { unit: 'g', amount: 120 }),
			FoodLogModel(new Date('2026-08-03T16:30:00Z'), riceFood, { unit: 'cup', amount: 1 }),
			FoodLogModel(new Date('2026-08-03T19:00:00Z'), chickenFood, { unit: 'oz', amount: 5 }),
		],
		onDelete: () => {},
	},
};

export const PartialDay: Story = {
	args: {
		foodLogs: [
			FoodLogModel(new Date('2026-08-03T08:00:00Z'), chickenFood, { unit: 'g', amount: 150 }),
			FoodLogModel(new Date('2026-08-03T20:30:00Z'), riceFood, { unit: 'ml', amount: 300 }),
		],
		onDelete: () => {},
	},
};

export const Empty: Story = {
	args: {
		foodLogs: [],
		onDelete: () => {},
	},
};
