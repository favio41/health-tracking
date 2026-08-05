import type { ComponentChildren, JSX } from 'preact';
import { createContext } from 'preact';
import { useContext, useEffect, useState } from 'preact/hooks';

import type { Food } from '../types';

const FoodsContext = createContext<Food[]>([]);

export function FoodsProvider({ children }: { children: ComponentChildren }): JSX.Element {
	const [data, setData] = useState<Food[]>([]);

	useEffect(() => {
		if (typeof window !== 'undefined') {
			fetch('/foods.json')
				.then((res) => res.json())
				.then((foods: Food[]) => setData(foods));
		}
	}, []);

	return <FoodsContext.Provider value={data}>{children}</FoodsContext.Provider>;
}

export function useFoods(): Food[] {
	return useContext(FoodsContext);
}
