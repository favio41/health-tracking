import type { ComponentChildren, JSX } from 'preact';
import { createContext } from 'preact';
import { useContext, useState } from 'preact/hooks';

import type { Settings } from '../types';
import { createDb } from '../utils/createDb';

const SettingsContext = createContext<{
	settings: Settings;
	updateSettings: (settings: Settings) => void;
}>({
	settings: {},
	updateSettings: () => {},
});

const db = createDb<Settings>('settings', {}, (key: string, value: unknown) => {
	if (key === 'trainingStartDate' && typeof value === 'string') {
		return new Date(value);
	}
	return value;
});

export function SettingsProvider({ children }: { children: ComponentChildren }): JSX.Element {
	const [settings, setSettings] = useState<Settings>(db.data);

	const updateSettings = (newSettings: Settings) => {
		db.update((data) => {
			Object.assign(data, newSettings);
		});
		setSettings({ ...db.data });
	};

	return <SettingsContext.Provider value={{ settings, updateSettings }}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
	return useContext(SettingsContext);
}
