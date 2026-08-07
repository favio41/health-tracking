/** biome-ignore-all lint/style/noNonNullAssertion: <explanation> */
import { describe, expect, it } from 'vitest';
import type { Settings } from '../types';
import { getMacronutrientGoals } from './macronutrientGoals';
import { MacronutrientSetupModel } from './macronutrientSetup';

describe('MacronutrientGoalsModel adapt', () => {
	const settings: Settings = {
		weightKg: 80,
		bodyFatPercentage: 15,
	};
	const setup = MacronutrientSetupModel(settings);
	if (!setup) throw Error('Setup error');

	it('should return null when weightKg is not provided', () => {
		const result = getMacronutrientGoals({ bodyFatPercentage: 15 });
		expect(result).toBeNull();
	});

	it('should return null when bodyFatPercentage is not provided', () => {
		const result = getMacronutrientGoals({ weightKg: 80 });
		expect(result).toBeNull();
	});

	it('should calculate adapt phase all workout macros correctly', () => {
		const result = getMacronutrientGoals(settings);
		expect(result).not.toBeNull();

		const workout = result!.adapt.all.workout;
		expect(workout).toMatchInlineSnapshot(`
				{
				  "calories": 2199,
				  "carbs": 112,
				  "fat": 128,
				  "protein": 150,
				}
			`);
	});

	it('should calculate adapt phase all non-workout macros correctly', () => {
		const result = getMacronutrientGoals(settings);
		expect(result).not.toBeNull();

		const nonWorkout = result!.adapt.all.nonWorkout;
		expect(nonWorkout).toMatchInlineSnapshot(`
				{
				  "calories": 1799,
				  "carbs": 45,
				  "fat": 127,
				  "protein": 120,
				}
			`);
	});
});
