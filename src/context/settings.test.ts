import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { Settings } from '../types';

import { createDb } from '../utils/createDb';

describe('settings persistence', () => {
	const testKey = 'settings-test-key';
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

	it('should create a settings database with default empty object', () => {
		const db = createDb<Settings>(testKey, {});
		expect(db.data).toEqual({});
	});

	it('should use default empty object when localStorage is empty', () => {
		const db = createDb<Settings>(testKey, {});
		expect(db.data).toEqual({});
		expect(db.data.trainingStartDate).toBeUndefined();
	});

	it('should persist trainingStartDate to localStorage', () => {
		const reviver = (key: string, value: unknown) => {
			if (key === 'trainingStartDate' && typeof value === 'string') {
				return new Date(value);
			}
			return value;
		};

		const db = createDb<Settings>(testKey, {}, reviver);
		const testDate = new Date('2026-08-01');

		db.update((data) => {
			data.trainingStartDate = testDate;
		});

		const stored = localStorage.getItem(testKey);
		expect(stored).toBeTruthy();
		expect(JSON.parse(stored as string)).toEqual({
			trainingStartDate: testDate.toISOString(),
		});
	});

	it('should revive trainingStartDate as a Date object when loading from localStorage', () => {
		const reviver = (key: string, value: unknown) => {
			if (key === 'trainingStartDate' && typeof value === 'string') {
				return new Date(value);
			}
			return value;
		};

		const testDate = new Date('2026-08-05');
		localStorage.setItem(testKey, JSON.stringify({ trainingStartDate: testDate.toISOString() }));

		const db = createDb<Settings>(testKey, {}, reviver);

		expect(db.data.trainingStartDate).toBeInstanceOf(Date);
		expect(db.data.trainingStartDate).toEqual(testDate);
	});

	it('should handle updates to trainingStartDate', () => {
		const reviver = (key: string, value: unknown) => {
			if (key === 'trainingStartDate' && typeof value === 'string') {
				return new Date(value);
			}
			return value;
		};

		const db = createDb<Settings>(testKey, {}, reviver);
		const date1 = new Date('2026-08-01');
		const date2 = new Date('2026-08-15');

		db.update((data) => {
			data.trainingStartDate = date1;
		});

		expect(db.data.trainingStartDate).toEqual(date1);

		db.update((data) => {
			data.trainingStartDate = date2;
		});

		expect(db.data.trainingStartDate).toEqual(date2);
		const stored = localStorage.getItem(testKey);
		expect(JSON.parse(stored as string)).toEqual({
			trainingStartDate: date2.toISOString(),
		});
	});

	it('should preserve undefined trainingStartDate', () => {
		const db = createDb<Settings>(testKey, {});

		db.update((data) => {
			// Explicitly set to undefined
			data.trainingStartDate = undefined;
		});

		const stored = localStorage.getItem(testKey);
		expect(stored).toBeTruthy();
		expect(JSON.parse(stored as string)).toEqual({});
	});
});
