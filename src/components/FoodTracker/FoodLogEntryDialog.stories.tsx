import type { Meta, StoryObj } from '@storybook/preact-vite';
import type { JSX } from 'preact';
import { FoodsProvider } from '@/context/foods';
import { FoodLogModel } from '@/models/foodLog';
import { FoodLogEntryDialog } from './FoodLogEntryDialog';

const meta = {
	title: 'Components/FoodLogEntryDialog',
	component: FoodLogEntryDialog,
	decorators: [
		(Story): JSX.Element => (
			<FoodsProvider>
				<Story />
			</FoodsProvider>
		),
	],
} satisfies Meta<typeof FoodLogEntryDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

const chickenFood = {
	source: 'USDA' as const,
	id: 'chicken-breast',
	name: 'CHICKEN,BREAST,SKINLESS',
	calories: 165,
	protein: 31,
	fat: 3.6,
	carbs: 0,
};

export const AddMode: Story = {
	args: {
		open: true,
		onSave: () => {},
		onClose: () => {},
	},
};

export const EditMode: Story = {
	args: {
		open: true,
		entry: FoodLogModel(new Date('2026-08-03T12:30:00'), chickenFood, { unit: 'g', amount: 150 }),
		onSave: () => {},
		onClose: () => {},
	},
};

export const Closed: Story = {
	args: {
		open: false,
		onSave: () => {},
		onClose: () => {},
	},
};
