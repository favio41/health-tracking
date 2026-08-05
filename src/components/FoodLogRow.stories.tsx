import type { Meta, StoryObj } from '@storybook/preact-vite';
import { FoodLogModel } from '../models/foodLog';
import { FoodLogRow } from './FoodLogRow';

const meta = {
	title: 'Components/FoodLogRow',
	component: FoodLogRow,
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
				<FoodLogRow {...args} />
			</tbody>
		</table>
	),
} satisfies Meta<typeof FoodLogRow>;

export default meta;
type Story = StoryObj<typeof meta>;

const chickenFood = {
	source: 'USDA' as const,
	id: 'chicken-breast',
	name: 'Chicken breast',
	calories: 165,
	protein: 31,
	fat: 3.6,
	carbs: 1,
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
		entry: FoodLogModel(new Date('2026-08-03T08:30:00Z'), chickenFood, { unit: 'g', amount: 150 }),
	},
};

export const WithMilliliters: Story = {
	args: {
		entry: FoodLogModel(new Date('2026-08-03T12:15:00Z'), riceFood, { unit: 'ml', amount: 200 }),
	},
};

export const WithCups: Story = {
	args: {
		entry: FoodLogModel(new Date('2026-08-03T18:45:00Z'), riceFood, { unit: 'cup', amount: 1 }),
	},
};

export const WithOunces: Story = {
	args: {
		entry: FoodLogModel(new Date('2026-08-03T20:00:00Z'), chickenFood, { unit: 'oz', amount: 5 }),
	},
};
