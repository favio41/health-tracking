import type { ComponentChildren, JSX } from 'preact';
import { createContext } from 'preact';
import { useContext, useEffect, useState } from 'preact/hooks';

import type { TrainingScheduleBaseline } from '../types';

const TrainingScheduleBaselineContext = createContext<TrainingScheduleBaseline | null>(null);

export function TrainingScheduleBaselineProvider({ children }: { children: ComponentChildren }): JSX.Element {
	const [data, setData] = useState<TrainingScheduleBaseline | null>(null);

	useEffect(() => {
		if (typeof window !== 'undefined') {
			fetch('/training-schedule.json')
				.then((res) => res.json())
				.then((training: TrainingScheduleBaseline) => setData(training));
		}
	}, []);

	return <TrainingScheduleBaselineContext.Provider value={data}>{children}</TrainingScheduleBaselineContext.Provider>;
}

export function useTrainingScheduleBaseline(): TrainingScheduleBaseline | null {
	return useContext(TrainingScheduleBaselineContext);
}
