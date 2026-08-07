import { describe, expect, it } from 'vitest';
import type { Settings, TrainingDayLog } from '@/types';
import { getLinearBaseline, trainingAndMacronutritionSchedule } from './trainingAndMacronutritionSchedule';

describe('trainingAndMacronutritionSchedule', () => {
	describe('trainingAndMacronutritionSchedule', () => {
		it('should return training logs', () => {
			const settings: Settings = { trainingStartDate: new Date('2026-07-30T00:00:00.000Z') };
			const result = trainingAndMacronutritionSchedule({
				settings,
				trainingDayLog: [],
				date: new Date('2026-08-02T16:37:00.000Z'),
			});

			const thereAreSkips = result.filter((r) => r.status === 'SKIPPED');
			expect(thereAreSkips).toHaveLength(0);

			expect(result.slice(0, 7)).toMatchSnapshot();

			expect(result.slice(-7)).toMatchSnapshot();
		});

		it('should return training logs with skipped days', () => {
			const settings: Settings = { trainingStartDate: new Date('2026-07-30T00:00:00.000Z') };
			const trainingDayLog: TrainingDayLog[] = [{ id: '1', datetime: new Date('2026-7-31'), type: 'SKIPPED' as const }];
			const result = trainingAndMacronutritionSchedule({
				settings,
				trainingDayLog,
				date: new Date('2026-08-02T16:37:00.000Z'),
			});

			const thereAreSkips = result.filter((r) => r.status === 'SKIPPED');
			expect(thereAreSkips).toHaveLength(1);

			expect(result.slice(0, 7)).toMatchSnapshot();

			expect(result.slice(-7)).toMatchSnapshot();
		});

		it('should return training logs with skipped days and macronutrientGoals', () => {
			const settings: Settings = {
				trainingStartDate: new Date('2026-07-30T00:00:00.000Z'),
				weightKg: 80,
				bodyFatPercentage: 15,
			};
			const trainingDayLog: TrainingDayLog[] = [{ id: '1', datetime: new Date('2026-7-31'), type: 'SKIPPED' as const }];
			const result = trainingAndMacronutritionSchedule({
				settings,
				trainingDayLog,
				date: new Date('2026-08-02T16:37:00.000Z'),
			});

			const thereAreSkips = result.filter((r) => r.status === 'SKIPPED');
			expect(thereAreSkips).toHaveLength(1);

			expect(result.slice(0, 7)).toMatchSnapshot();

			expect(result.slice(-7)).toMatchSnapshot();
		});
	});

	describe('getLinearBaseline', () => {
		it('should return the correct sequence', () => {
			const result = getLinearBaseline();

			expect(result).toHaveLength(112);
			const first = result[0];
			expect(first).toMatchInlineSnapshot(`
				{
				  "nutrition": "16/8",
				  "phase": "prime",
				  "training": "1",
				  "week": "week1",
				}
			`);
			const primeWeek2 = result[7];
			expect(primeWeek2.week).toBe('week2');

			const firstAdapt = result[28];
			expect(firstAdapt).toMatchInlineSnapshot(`
				{
				  "nutrition": "16/8",
				  "phase": "adapt",
				  "training": "1",
				  "week": "week1",
				}
			`);

			const firstCardio = result[35];
			expect(firstCardio.training).toBe('CARDIO');
			expect(firstCardio.nutrition).toBe('FULL_FAST');

			const firstSurge = result[56];
			expect(firstSurge).toMatchInlineSnapshot(`
				{
				  "nutrition": "16/8",
				  "phase": "surge",
				  "training": "1",
				  "week": "week1",
				}
			`);
		});
	});
});
