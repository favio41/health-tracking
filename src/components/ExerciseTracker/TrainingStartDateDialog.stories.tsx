import { TrainingStartDateDialog } from './TrainingStartDateDialog';

export default {
	title: 'ExerciseTracker/TrainingStartDateDialog',
	component: TrainingStartDateDialog,
};

export const Open = () => <TrainingStartDateDialog open={true} onClose={() => console.log('closed')} />;

export const Closed = () => <TrainingStartDateDialog open={false} onClose={() => console.log('closed')} />;
