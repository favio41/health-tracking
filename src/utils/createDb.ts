export function createDb<T>(key: string, defaultData: T, reviver?: (key: string, value: unknown) => unknown) {
	const db = {
		data: defaultData,

		read() {
			const stored = localStorage.getItem(key);
			this.data = stored ? JSON.parse(stored, reviver) : defaultData;
		},

		update(fn: (data: T) => void) {
			fn(this.data);
			localStorage.setItem(key, JSON.stringify(this.data));
		},
	};

	db.read();
	return db;
}
