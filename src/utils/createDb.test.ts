import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createDb } from './createDb';

describe('createDb', () => {
	const testKey = 'test-db-key';
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

	it('should create a database with default data', () => {
		const defaultData = { count: 0, items: [] };
		const db = createDb(testKey, defaultData);

		expect(db.data).toEqual(defaultData);
	});

	it('should read from localStorage on initialization', () => {
		const initialData = { count: 5, items: ['a', 'b'] };
		localStorage.setItem(testKey, JSON.stringify(initialData));

		const db = createDb(testKey, { count: 0, items: [] });

		expect(db.data).toEqual(initialData);
	});

	it('should use default data when localStorage is empty', () => {
		const defaultData = { count: 0, items: [] };
		const db = createDb(testKey, defaultData);

		expect(db.data).toEqual(defaultData);
	});

	it('should update data and persist to localStorage', () => {
		const defaultData = { count: 0 };
		const db = createDb(testKey, defaultData);

		db.update((data) => {
			data.count = 5;
		});

		expect(db.data).toEqual({ count: 5 });
		const stored = localStorage.getItem(testKey);
		expect(stored).toBeTruthy();
		expect(JSON.parse(stored as string)).toEqual({ count: 5 });
	});

	it('should handle complex objects', () => {
		const defaultData = {
			users: [{ id: 1, name: 'Alice' }],
			settings: { theme: 'light' },
		};
		const db = createDb(testKey, defaultData);

		db.update((data) => {
			data.users.push({ id: 2, name: 'Bob' });
			data.settings.theme = 'dark';
		});

		expect(db.data.users).toHaveLength(2);
		expect(db.data.settings.theme).toBe('dark');
		const stored = localStorage.getItem(testKey);
		expect(stored).toBeTruthy();
		expect(JSON.parse(stored as string)).toEqual(db.data);
	});

	it('should read method to restore from localStorage', () => {
		const defaultData = { value: 0 };
		const db = createDb(testKey, defaultData);

		db.update((data) => {
			data.value = 10;
		});

		localStorage.setItem(testKey, JSON.stringify({ value: 20 }));
		db.read();

		expect(db.data.value).toBe(20);
	});

	it('should handle array data', () => {
		const defaultData: number[] = [];
		const db = createDb(testKey, defaultData);

		db.update((data) => {
			data.push(1, 2, 3);
		});

		expect(db.data).toEqual([1, 2, 3]);
		const stored = localStorage.getItem(testKey);
		expect(stored).toBeTruthy();
		expect(JSON.parse(stored as string)).toEqual([1, 2, 3]);
	});

	it('should handle number data', () => {
		const defaultData = 0;
		const db = createDb(testKey, defaultData);

		expect(db.data).toBe(0);

		db.update((_data) => {
			Object.assign(db, { data: 42 });
		});

		const stored = localStorage.getItem(testKey);
		expect(stored).toBeTruthy();
		expect(JSON.parse(stored as string)).toBe(42);
	});
});
