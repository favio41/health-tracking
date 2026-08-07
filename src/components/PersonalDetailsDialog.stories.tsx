import type { Meta, StoryObj } from '@storybook/preact-vite';
import type { JSX } from 'preact';
import { SettingsProvider } from '../context/settings';
import { PersonalDetailsDialog } from './PersonalDetailsDialog';

const meta = {
	title: 'Components/PersonalDetailsDialog',
	component: PersonalDetailsDialog,
	decorators: [
		(Story): JSX.Element => (
			<SettingsProvider>
				<Story />
			</SettingsProvider>
		),
	],
} satisfies Meta<typeof PersonalDetailsDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
	args: {
		open: true,
		onClose: () => {},
	},
};

export const Closed: Story = {
	args: {
		open: false,
		onClose: () => {},
	},
};
