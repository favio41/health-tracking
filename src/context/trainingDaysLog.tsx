import type { ComponentChildren, JSX } from 'preact';
import { createContext } from 'preact';
import { useContext, useState } from 'preact/hooks';

import type { TrainingDayLog } from '../types';
import { createDb } from '../utils/createDb';

const TrainingDaysLogContext = createContext<{
	trainingDaysLog: TrainingDayLog[];
	addTrainingDayLog: (log: TrainingDayLog) => void;
	removeTrainingDayLog: (id: string) => void;
}>({
	trainingDaysLog: [],
	addTrainingDayLog: () => {},
	removeTrainingDayLog: () => {},
});

const db = createDb<TrainingDayLog[]>('trainingDaysLog', [], (key: string, value: unknown) => {
	if (key === 'datetime' && typeof value === 'string') {
		return new Date(value);
	}
	return value;
});

export function TrainingDaysLogProvider({ children }: { children: ComponentChildren }): JSX.Element {
	const [trainingDaysLog, setTrainingDaysLog] = useState<TrainingDayLog[]>(db.data);

	const addLog = (log: TrainingDayLog) => {
		db.update((data) => {
			data.unshift(log);
		});
		setTrainingDaysLog([...db.data]);
	};

	const removeLog = (id: string) => {
		db.update((data) => {
			const index = data.findIndex((log) => log.id === id);
			if (index !== -1) {
				data.splice(index, 1);
			}
		});
		setTrainingDaysLog([...db.data]);
	};

	return (
		<TrainingDaysLogContext.Provider
			value={{
				trainingDaysLog: trainingDaysLog,
				addTrainingDayLog: addLog,
				removeTrainingDayLog: removeLog,
			}}
		>
			{children}
		</TrainingDaysLogContext.Provider>
	);
}

export function useTrainingDaysLog() {
	return useContext(TrainingDaysLogContext);
}
