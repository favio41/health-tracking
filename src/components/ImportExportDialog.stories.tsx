import type { Meta, StoryObj } from '@storybook/preact-vite';
import type { JSX } from 'preact';
import { FoodLogsProvider } from '../context/foodLogs';
import { ImportExportDialog } from './ImportExportDialog';

const meta = {
	title: 'Components/ImportExportDialog',
	component: ImportExportDialog,
	decorators: [
		(Story): JSX.Element => (
			<FoodLogsProvider>
				<Story />
			</FoodLogsProvider>
		),
	],
} satisfies Meta<typeof ImportExportDialog>;

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
