/** biome-ignore-all lint/style/noNonNullAssertion: <explanation> */
import { describe, expect, it } from 'vitest';
import type { Settings } from '../types';
import { MacronutrientSetupModel } from './macronutrientSetup';

describe('MacronutrientSetupModel', () => {
	it('should return null when weightKg is not provided', () => {
		const settings: Settings = {
			bodyFatPercentage: 15,
		};
		const result = MacronutrientSetupModel(settings);
		expect(result).toBeNull();
	});

	it('should return null when bodyFatPercentage is not provided', () => {
		const settings: Settings = {
			weightKg: 80,
		};
		const result = MacronutrientSetupModel(settings);
		expect(result).toBeNull();
	});

	it('should calculate currentWeightLb correctly', () => {
		const settings: Settings = {
			weightKg: 80,
			bodyFatPercentage: 15,
		};
		const result = MacronutrientSetupModel(settings);
		expect(result).not.toBeNull();
		if (result) {
			expect(result.currentWeightLb).toBeCloseTo(176.37, 1);
		}
	});

	it('should calculate bodyFatLb correctly', () => {
		const settings: Settings = {
			weightKg: 80,
			bodyFatPercentage: 15,
		};
		const result = MacronutrientSetupModel(settings);
		expect(result).not.toBeNull();
		if (result) {
			expect(result.bodyFatLb).toBeCloseTo(26.45, 1);
		}
	});

	it('should calculate leanBodyMassLb correctly', () => {
		const settings: Settings = {
			weightKg: 80,
			bodyFatPercentage: 15,
		};
		const result = MacronutrientSetupModel(settings);
		expect(result).not.toBeNull();
		if (result) {
			expect(result.leanBodyMassLb).toBeCloseTo(149.92, 1);
		}
	});

	it('should use multiplier 17 for body fat 0-12%', () => {
		const settings: Settings = {
			weightKg: 80,
			bodyFatPercentage: 10,
		};
		const result = MacronutrientSetupModel(settings);
		expect(result).not.toBeNull();
		if (result) {
			expect(result.calorieMultiplier).toBe(17);
		}
	});

	it('should use multiplier 16 for body fat 12.1-15%', () => {
		const settings: Settings = {
			weightKg: 80,
			bodyFatPercentage: 14,
		};
		const result = MacronutrientSetupModel(settings);
		expect(result).not.toBeNull();
		if (result) {
			expect(result.calorieMultiplier).toBe(16);
		}
	});

	it('should use multiplier 15 for body fat 15.1-19%', () => {
		const settings: Settings = {
			weightKg: 80,
			bodyFatPercentage: 17,
		};
		const result = MacronutrientSetupModel(settings);
		expect(result).not.toBeNull();
		if (result) {
			expect(result.calorieMultiplier).toBe(15);
		}
	});

	it('should use multiplier 14 for body fat 19.1-22%', () => {
		const settings: Settings = {
			weightKg: 80,
			bodyFatPercentage: 21,
		};
		const result = MacronutrientSetupModel(settings);
		expect(result).not.toBeNull();
		if (result) {
			expect(result.calorieMultiplier).toBe(14);
		}
	});

	it('should use multiplier 13 for body fat 22.1% and above', () => {
		const settings: Settings = {
			weightKg: 80,
			bodyFatPercentage: 25,
		};
		const result = MacronutrientSetupModel(settings);
		expect(result).not.toBeNull();
		if (result) {
			expect(result.calorieMultiplier).toBe(13);
		}
	});

	it('should calculate maintenanceCalories correctly', () => {
		const settings: Settings = {
			weightKg: 80,
			bodyFatPercentage: 15,
		};
		const result = MacronutrientSetupModel(settings);
		expect(result).not.toBeNull();
		if (result) {
			const expectedCalories = Math.round(result.leanBodyMassLb * result.calorieMultiplier);
			expect(result.maintenanceCalories).toBe(expectedCalories);
		}
	});

	it('should handle edge case at body fat 12%', () => {
		const settings: Settings = {
			weightKg: 80,
			bodyFatPercentage: 12,
		};
		const result = MacronutrientSetupModel(settings);
		expect(result).not.toBeNull();
		if (result) {
			expect(result.calorieMultiplier).toBe(17);
		}
	});

	it('should handle edge case at body fat 12.1%', () => {
		const settings: Settings = {
			weightKg: 80,
			bodyFatPercentage: 12.1,
		};
		const result = MacronutrientSetupModel(settings);
		expect(result).not.toBeNull();
		if (result) {
			expect(result.calorieMultiplier).toBe(16);
		}
	});

	it('should handle very low body weight', () => {
		const settings: Settings = {
			weightKg: 50,
			bodyFatPercentage: 15,
		};
		const result = MacronutrientSetupModel(settings);
		expect(result).not.toBeNull();
		if (result) {
			expect(result.currentWeightLb).toBeCloseTo(110.23, 1);
			expect(result.leanBodyMassLb).toBeGreaterThan(0);
		}
	});

	it('should handle very high body weight', () => {
		const settings: Settings = {
			weightKg: 150,
			bodyFatPercentage: 20,
		};
		const result = MacronutrientSetupModel(settings);
		expect(result).not.toBeNull();
		if (result) {
			expect(result.currentWeightLb).toBeCloseTo(330.69, 1);
			expect(result.leanBodyMassLb).toBeGreaterThan(0);
		}
	});

	it('should handle zero body fat percentage', () => {
		const settings: Settings = {
			weightKg: 80,
			bodyFatPercentage: 0,
		};
		const result = MacronutrientSetupModel(settings);
		expect(result).not.toBeNull();
		if (result) {
			expect(result.bodyFatLb).toBe(0);
			expect(result.leanBodyMassLb).toBe(result.currentWeightLb);
			expect(result.calorieMultiplier).toBe(17);
		}
	});

	it('should return rounded values', () => {
		const settings: Settings = {
			weightKg: 80.55,
			bodyFatPercentage: 15.75,
		};
		const result = MacronutrientSetupModel(settings);
		expect(result).not.toBeNull();
		if (result) {
			expect(Number.isFinite(result.currentWeightLb)).toBe(true);
			expect(Number.isFinite(result.bodyFatLb)).toBe(true);
			expect(Number.isFinite(result.leanBodyMassLb)).toBe(true);
			expect(Number.isInteger(result.maintenanceCalories)).toBe(true);
		}
	});

	it('should produce complete MacronutrientGoals object', () => {
		const settings: Settings = {
			weightKg: 85,
			bodyFatPercentage: 18,
		};
		const result = MacronutrientSetupModel(settings);
		expect(result).not.toBeNull();
		if (result) {
			expect(result).toHaveProperty('currentWeightLb');
			expect(result).toHaveProperty('bodyFatLb');
			expect(result).toHaveProperty('leanBodyMassLb');
			expect(result).toHaveProperty('calorieMultiplier');
		}
	});
});
