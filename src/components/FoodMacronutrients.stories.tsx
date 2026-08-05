import type { Meta, StoryObj } from '@storybook/preact-vite';
import { FoodMacros } from './FoodMacros';

const meta = {
	title: 'Components/FoodMacros',
	component: FoodMacros,
} satisfies Meta<typeof FoodMacros>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		food: {
			source: 'custom',
			id: 'demo-1',
			name: 'Chicken breast',
			calories: 165,
			protein: 31,
			fat: 3.6,
			carbs: 0,
		},
	},
};
