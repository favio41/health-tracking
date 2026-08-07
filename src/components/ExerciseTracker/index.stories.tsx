import type { Meta, StoryObj } from '@storybook/preact-vite';
import type { JSX } from 'preact';
import { SettingsProvider } from '@/context/settings';
import { ExerciseTracker } from './index';

const meta = {
	title: 'Components/ExerciseTracker',
	component: ExerciseTracker,
	decorators: [
		(Story): JSX.Element => (
			<SettingsProvider>
				<Story />
			</SettingsProvider>
		),
	],
} satisfies Meta<typeof ExerciseTracker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
	args: {
		onAddEntry: () => {},
	},
};
