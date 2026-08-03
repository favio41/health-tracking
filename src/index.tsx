import { hydrate, prerender as ssr } from 'preact-iso';

import './style.css';
import { FoodsProvider, useFoods } from './context/foods';

function AppContent() {
	const data = useFoods();
	return <div>hi. foods length {data?.length || 0}</div>;
}

export function App() {
	return (
		<FoodsProvider>
			<AppContent />
		</FoodsProvider>
	);
}

if (typeof window !== 'undefined') {
	const app = document.getElementById('app');
	if (app) {
		hydrate(<App />, app);
	}
}

export async function prerender(data: Record<string, unknown>) {
	return await ssr(<App {...data} />);
}
