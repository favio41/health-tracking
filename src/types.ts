export interface Food {
	source: 'uk-coFID' | 'USDA' | 'custom';
	id: string;
	name: string;
	calories: number;
	protein: number;
	fat: number;
	carbs: number;
	sugar?: number;
}
