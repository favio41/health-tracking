/** biome-ignore-all lint/style/noNonNullAssertion: <explanation> */
import { describe, expect, it } from 'vitest';
import type { Settings } from '../types';
import { getMacronutrientGoals } from './macronutrientGoals';
import { MacronutrientSetupModel } from './macronutrientSetup';

describe('MacronutrientGoalsModel complete', () => {
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

	it('should calculate complete phase all workout macros correctly', () => {
		const result = getMacronutrientGoals(settings);
		expect(result).not.toBeNull();

		const workout = result!.complete.all.workout;
		expect(workout).toMatchInlineSnapshot(`
			{
			  "calories": 2699,
			  "carbs": 150,
			  "fat": 133,
			  "protein": 225,
			}
		`);
	});

	it('should calculate complete phase all non-workout macros correctly', () => {
		const result = getMacronutrientGoals(settings);
		expect(result).not.toBeNull();

		const nonWorkout = result!.complete.all.nonWorkout;
		expect(nonWorkout).toMatchInlineSnapshot(`
			{
			  "calories": 1999,
			  "carbs": 37,
			  "fat": 139,
			  "protein": 150,
			}
		`);
	});
});
