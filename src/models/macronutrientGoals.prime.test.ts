/** biome-ignore-all lint/style/noNonNullAssertion: <explanation> */
import { describe, expect, it } from 'vitest';
import type { Settings } from '../types';
import { getMacronutrientGoals } from './macronutrientGoals';
import { MacronutrientSetupModel } from './macronutrientSetup';

describe('MacronutrientGoalsModel prime', () => {
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

	it('should calculate prime phase week1 workout macros correctly', () => {
		const result = getMacronutrientGoals(settings);
		expect(result).not.toBeNull();

		const workout = result!.prime.week1.workout;
		expect(workout).toMatchInlineSnapshot(`
				{
				  "calories": 2099,
				  "carbs": 30,
				  "fat": 167,
				  "protein": 120,
				}
			`);
	});

	it('should calculate prime phase week1 non-workout macros correctly', () => {
		const result = getMacronutrientGoals(settings);
		expect(result).not.toBeNull();

		const workout = result!.prime.week1.nonWorkout;
		expect(workout).toMatchInlineSnapshot(`
				{
				  "calories": 1899,
				  "carbs": 0,
				  "fat": 164,
				  "protein": 105,
				}
			`);
	});

	it('should calculate prime phase week2 workout macros correctly', () => {
		const result = getMacronutrientGoals(settings);
		expect(result).not.toBeNull();

		const workout = result!.prime.week2.workout;
		expect(workout).toMatchInlineSnapshot(`
				{
				  "calories": 2099,
				  "carbs": 30,
				  "fat": 167,
				  "protein": 120,
				}
			`);
	});

	it('should calculate prime phase week2 non-workout macros correctly', () => {
		const result = getMacronutrientGoals(settings);
		expect(result).not.toBeNull();

		const workout = result!.prime.week2.nonWorkout;
		expect(workout).toMatchInlineSnapshot(`
				{
				  "calories": 1899,
				  "carbs": 0,
				  "fat": 164,
				  "protein": 105,
				}
			`);
	});

	it('should calculate prime phase week3 workout macros correctly', () => {
		const result = getMacronutrientGoals(settings);
		expect(result).not.toBeNull();

		const workout = result!.prime.week3.workout;
		expect(workout).toMatchInlineSnapshot(`
				{
				  "calories": 2099,
				  "carbs": 75,
				  "fat": 147,
				  "protein": 120,
				}
			`);
	});

	it('should calculate prime phase week3 non-workout macros correctly', () => {
		const result = getMacronutrientGoals(settings);
		expect(result).not.toBeNull();

		const workout = result!.prime.week3.nonWorkout;
		expect(workout).toMatchInlineSnapshot(`
				{
				  "calories": 1899,
				  "carbs": 0,
				  "fat": 164,
				  "protein": 105,
				}
			`);
	});

	it('should calculate prime phase week4 workout macros correctly', () => {
		const result = getMacronutrientGoals(settings);
		expect(result).not.toBeNull();

		const workout = result!.prime.week4.workout;
		expect(workout).toMatchInlineSnapshot(`
				{
				  "calories": 2099,
				  "carbs": 100,
				  "fat": 135,
				  "protein": 120,
				}
			`);
	});

	it('should calculate prime phase week4 non-workout macros correctly', () => {
		const result = getMacronutrientGoals(settings);
		expect(result).not.toBeNull();

		const workout = result!.prime.week4.nonWorkout;
		expect(workout).toMatchInlineSnapshot(`
				{
				  "calories": 1899,
				  "carbs": 50,
				  "fat": 142,
				  "protein": 105,
				}
			`);
	});
});
