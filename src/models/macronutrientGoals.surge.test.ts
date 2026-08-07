/** biome-ignore-all lint/style/noNonNullAssertion: <explanation> */
import { describe, expect, it } from 'vitest';
import type { Settings } from '../types';
import { getMacronutrientGoals } from './macronutrientGoals';
import { MacronutrientSetupModel } from './macronutrientSetup';

describe('MacronutrientGoalsModel surge', () => {
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

	it('should calculate surge phase all workout macros correctly', () => {
		const result = getMacronutrientGoals(settings);
		expect(result).not.toBeNull();

		const workout = result!.surge.all.workout;
		expect(workout).toMatchInlineSnapshot(`
			{
			  "calories": 2799,
			  "carbs": 150,
			  "fat": 144,
			  "protein": 225,
			}
		`);
	});

	it('should calculate surge phase all non-workout macros correctly', () => {
		const result = getMacronutrientGoals(settings);
		expect(result).not.toBeNull();

		const nonWorkout = result!.surge.all.nonWorkout;
		expect(nonWorkout).toMatchInlineSnapshot(`
			{
			  "calories": 2199,
			  "carbs": 75,
			  "fat": 128,
			  "protein": 187,
			}
		`);
	});
});
