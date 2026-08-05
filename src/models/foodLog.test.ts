import { describe, expect, it } from 'vitest';
import type { Food, FoodLogAmount } from '../types';
import { FoodLogModel } from './foodLog';

describe('FoodLogModel', () => {
	const mockFood: Food = {
		source: 'USDA',
		id: '1',
		name: 'Chicken Breast',
		calories: 165,
		protein: 31,
		fat: 3.6,
		carbs: 0,
		sugar: 0,
	};

	it('should create a food log instance', () => {
		const datetime = new Date('2026-08-03T12:00:00Z');
		const amount: FoodLogAmount = { unit: 'g', amount: 100 };
		const foodLog = FoodLogModel(datetime, mockFood, amount);

		expect(foodLog).toBeDefined();
		expect(foodLog.datetime).toBe(datetime);
		expect(foodLog.food).toBe(mockFood);
		expect(foodLog.amount).toBe(amount);
	});

	it('should calculate macronutrients for grams', () => {
		const datetime = new Date('2026-08-03T12:00:00Z');
		const amount: FoodLogAmount = { unit: 'g', amount: 100 };
		const foodLog = FoodLogModel(datetime, mockFood, amount);

		expect(foodLog.macronutrients).toEqual({
			calories: 165,
			protein: 31,
			fat: 3.6,
			carbs: 0,
			sugar: 0,
		});
	});

	it('should scale macronutrients for different amounts', () => {
		const datetime = new Date('2026-08-03T12:00:00Z');
		const amount: FoodLogAmount = { unit: 'g', amount: 200 };
		const foodLog = FoodLogModel(datetime, mockFood, amount);

		expect(foodLog.macronutrients).toEqual({
			calories: 330,
			protein: 62,
			fat: 7.2,
			carbs: 0,
			sugar: 0,
		});
	});

	it('should convert ounces to grams', () => {
		const datetime = new Date('2026-08-03T12:00:00Z');
		const amount: FoodLogAmount = { unit: 'oz', amount: 1 };
		const foodLog = FoodLogModel(datetime, mockFood, amount);

		// 1 oz = 28.35g, so scale = 0.2835
		expect(foodLog.macronutrients).toEqual({
			calories: 47,
			protein: 8.8,
			fat: 1,
			carbs: 0,
			sugar: 0,
		});
	});

	it('should convert cups to grams', () => {
		const datetime = new Date('2026-08-03T12:00:00Z');
		const amount: FoodLogAmount = { unit: 'cup', amount: 1 };
		const foodLog = FoodLogModel(datetime, mockFood, amount);

		// 1 cup = 240g, so scale = 2.4
		expect(foodLog.macronutrients).toEqual({
			calories: 396,
			protein: 74.4,
			fat: 8.6,
			carbs: 0,
			sugar: 0,
		});
	});

	it('should convert milliliters to grams', () => {
		const datetime = new Date('2026-08-03T12:00:00Z');
		const amount: FoodLogAmount = { unit: 'ml', amount: 100 };
		const foodLog = FoodLogModel(datetime, mockFood, amount);

		expect(foodLog.macronutrients).toEqual({
			calories: 165,
			protein: 31,
			fat: 3.6,
			carbs: 0,
			sugar: 0,
		});
	});

	it('should convert servings', () => {
		const datetime = new Date('2026-08-03T12:00:00Z');
		const amount: FoodLogAmount = { unit: 'serving', amount: 1 };
		const foodLog = FoodLogModel(datetime, mockFood, amount);

		// 1 serving = 100g, so scale = 1
		expect(foodLog.macronutrients).toEqual({
			calories: 165,
			protein: 31,
			fat: 3.6,
			carbs: 0,
			sugar: 0,
		});
	});

	it('should handle foods with sugar content', () => {
		const datetime = new Date('2026-08-03T12:00:00Z');
		const foodWithSugar: Food = {
			...mockFood,
			sugar: 5,
		};
		const amount: FoodLogAmount = { unit: 'g', amount: 100 };
		const foodLog = FoodLogModel(datetime, foodWithSugar, amount);

		expect(foodLog.macronutrients.sugar).toBe(5);
	});

	it('should return 0 for sugar when not provided', () => {
		const datetime = new Date('2026-08-03T12:00:00Z');
		const foodWithoutSugar: Food = {
			...mockFood,
			sugar: undefined,
		};
		const amount: FoodLogAmount = { unit: 'g', amount: 100 };
		const foodLog = FoodLogModel(datetime, foodWithoutSugar, amount);

		expect(foodLog.macronutrients.sugar).toBe(0);
	});

	it('should round calories to nearest integer', () => {
		const datetime = new Date('2026-08-03T12:00:00Z');
		const amount: FoodLogAmount = { unit: 'g', amount: 50 };
		const foodLog = FoodLogModel(datetime, mockFood, amount);

		expect(Number.isInteger(foodLog.macronutrients.calories)).toBe(true);
	});

	it('should round macros to one decimal place', () => {
		const datetime = new Date('2026-08-03T12:00:00Z');
		const amount: FoodLogAmount = { unit: 'g', amount: 75 };
		const foodLog = FoodLogModel(datetime, mockFood, amount);
		const macros = foodLog.macronutrients;

		expect(macros.protein).toBe(Math.round(macros.protein * 10) / 10);
		expect(macros.fat).toBe(Math.round(macros.fat * 10) / 10);
		expect(macros.carbs).toBe(Math.round(macros.carbs * 10) / 10);
		if (macros.sugar !== undefined) {
			expect(macros.sugar).toBe(Math.round(macros.sugar * 10) / 10);
		}
	});
});
