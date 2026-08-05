import type { ComponentChildren, JSX } from 'preact';
import { createContext } from 'preact';
import { useContext, useState } from 'preact/hooks';

import type { FoodLog, ImportResult } from '../types';
import { createDb } from '../utils/createDb';

const FoodLogsContext = createContext<{
	foodLogs: FoodLog[];
	addFoodLog: (log: FoodLog) => void;
	removeFoodLog: (id: string) => void;
	importFoodLogBatch: (logs: unknown[]) => ImportResult;
}>({
	foodLogs: [],
	addFoodLog: () => {},
	removeFoodLog: () => {},
	importFoodLogBatch: () => ({ imported: 0, failed: 0, skipped: 0 }),
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

	const removeLog = (id: string) => {
		db.update((data) => {
			const index = data.findIndex((log) => log.id === id);
			if (index !== -1) {
				data.splice(index, 1);
			}
		});
		setFoodLogs([...db.data]);
	};

	const importBatch = (logs: unknown[]): ImportResult => {
		let imported = 0;
		let failed = 0;
		let skipped = 0;

		db.update((data) => {
			logs.forEach((log) => {
				try {
					if (!log || typeof log !== 'object') {
						failed++;
						return;
					}

					const logObj = log as Record<string, unknown>;
					const reconstructed: FoodLog = {
						id: typeof logObj.id === 'string' ? logObj.id : crypto.randomUUID(),
						datetime:
							logObj.datetime instanceof Date ? logObj.datetime : new Date(String(logObj.datetime ?? new Date())),
						food: logObj.food as FoodLog['food'],
						amount: logObj.amount as FoodLog['amount'],
						macronutrients: logObj.macronutrients as FoodLog['macronutrients'],
					};

					if (!reconstructed.food?.id || !reconstructed.amount?.unit) {
						failed++;
						return;
					}

					if (data.some((existingLog) => existingLog.id === reconstructed.id)) {
						skipped++;
						return;
					}

					data.push(reconstructed);
					imported++;
				} catch (err) {
					console.error('Error parsing individual log:', err);
					failed++;
				}
			});
		});

		setFoodLogs([...db.data]);
		return { imported, failed, skipped };
	};

	return (
		<FoodLogsContext.Provider
			value={{ foodLogs: foodLogs, addFoodLog: addLog, removeFoodLog: removeLog, importFoodLogBatch: importBatch }}
		>
			{children}
		</FoodLogsContext.Provider>
	);
}

export function useFoodLogs() {
	return useContext(FoodLogsContext);
}
