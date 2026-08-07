import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { TrainingDayLog } from '../types';

import { createDb } from '../utils/createDb';

describe('trainingDaysLog persistence', () => {
	const testKey = 'trainingDaysLog-test-key';
	let store: Record<string, string> = {};

	beforeEach(() => {
		store = {};
		global.localStorage = {
			getItem: (key: string) => store[key] || null,
			setItem: (key: string, value: string) => {
				store[key] = value;
			},
			removeItem: (key: string) => {
				delete store[key];
			},
			clear: () => {
				store = {};
			},
			key: () => null,
			length: 0,
		} as Storage;
	});

	afterEach(() => {
		store = {};
	});

	it('should create a trainingDaysLog database with default empty array', () => {
		const db = createDb<TrainingDayLog[]>(testKey, []);
		expect(db.data).toEqual([]);
	});

	it('should use default empty array when localStorage is empty', () => {
		const db = createDb<TrainingDayLog[]>(testKey, []);
		expect(db.data).toEqual([]);
	});

	it('should persist a training day log entry to localStorage', () => {
		const reviver = (key: string, value: unknown) => {
			if (key === 'datetime' && typeof value === 'string') {
				return new Date(value);
			}
			return value;
		};

		const db = createDb<TrainingDayLog[]>(testKey, [], reviver);
		const testDate = new Date('2026-08-05');
		const log: TrainingDayLog = {
			id: 'test-id-1',
			datetime: testDate,
			type: 'SKIPPED',
		};

		db.update((data) => {
			data.push(log);
		});

		const stored = localStorage.getItem(testKey);
		expect(stored).toBeTruthy();
		const parsed = JSON.parse(stored as string);
		expect(parsed).toHaveLength(1);
		expect(parsed[0]).toEqual({
			id: 'test-id-1',
			datetime: testDate.toISOString(),
			type: 'SKIPPED',
		});
	});

	it('should revive datetime as a Date object when loading from localStorage', () => {
		const reviver = (key: string, value: unknown) => {
			if (key === 'datetime' && typeof value === 'string') {
				return new Date(value);
			}
			return value;
		};

		const testDate = new Date('2026-08-05');
		const logData = {
			id: 'test-id-1',
			datetime: testDate.toISOString(),
			type: 'SKIPPED' as const,
		};
		localStorage.setItem(testKey, JSON.stringify([logData]));

		const db = createDb<TrainingDayLog[]>(testKey, [], reviver);

		expect(db.data).toHaveLength(1);
		expect(db.data[0].datetime).toBeInstanceOf(Date);
		expect(db.data[0].datetime).toEqual(testDate);
		expect(db.data[0].type).toEqual('SKIPPED');
	});

	it('should support adding and removing logs', () => {
		const reviver = (key: string, value: unknown) => {
			if (key === 'datetime' && typeof value === 'string') {
				return new Date(value);
			}
			return value;
		};

		const db = createDb<TrainingDayLog[]>(testKey, [], reviver);
		const log1: TrainingDayLog = {
			id: 'id-1',
			datetime: new Date('2026-08-05'),
			type: 'SKIPPED',
		};
		const log2: TrainingDayLog = {
			id: 'id-2',
			datetime: new Date('2026-08-06'),
			type: 'SKIPPED',
		};

		db.update((data) => {
			data.push(log1);
			data.push(log2);
		});

		expect(db.data).toHaveLength(2);

		db.update((data) => {
			const index = data.findIndex((log) => log.id === 'id-1');
			if (index !== -1) {
				data.splice(index, 1);
			}
		});

		expect(db.data).toHaveLength(1);
		expect(db.data[0].id).toEqual('id-2');
	});
});
