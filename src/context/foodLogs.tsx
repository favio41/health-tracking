import type { ComponentChildren, JSX } from 'preact';
import { createContext } from 'preact';
import { useContext, useState } from 'preact/hooks';

import type { FoodLog } from '../types';
import { createDb } from '../utils/createDb';

const FoodLogsContext = createContext<{
	foodLogs: FoodLog[];
	addFoodLog: (log: FoodLog) => void;
	removeFoodLog: (index: number) => void;
}>({
	foodLogs: [],
	addFoodLog: () => {},
	removeFoodLog: () => {},
});

const db = createDb<FoodLog[]>('foodLogs', [], (key: string, value: unknown) => {
	if (key === 'datetime' && typeof value === 'string') {
		return new Date(value);
	}
	return value;
});

export function FoodLogsProvider({ children }: { children: ComponentChildren }): JSX.Element {
	const [foodLogs, setFoodLogs] = useState<FoodLog[]>(db.data);

	const addLog = (log: FoodLog) => {
		db.update((data) => {
			data.push(log);
		});
		setFoodLogs([...db.data]);
	};

	const removeLog = (index: number) => {
		db.update((data) => {
			data.splice(index, 1);
		});
		setFoodLogs([...db.data]);
	};

	return (
		<FoodLogsContext.Provider value={{ foodLogs: foodLogs, addFoodLog: addLog, removeFoodLog: removeLog }}>
			{children}
		</FoodLogsContext.Provider>
	);
}

export function useFoodLogs() {
	return useContext(FoodLogsContext);
}
