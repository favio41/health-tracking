## Structure

### `src/components/`
UI components for the food tracker:
- `Navigation.tsx` — Header with menu actions
- `ExerciseTracker/` — ExerciseTracker feature components (see `ExerciseTracker/CLAUDE.md`) — placeholder wrapper only, not yet implemented
- `FoodTracker/` — FoodTracker feature components (see `FoodTracker/CLAUDE.md`)
- `*.stories.tsx` — Storybook files for component testing (skip testing)

### `src/context/`
React Context providers for shared state:
- `foods.tsx` — Manages available foods list (from public/foods.json)
- `foodLogs.tsx` — Manages user's food log entries (add, delete, query)
- `settings.tsx` — Manages app settings in localStorage (training start date)
- `training-schedule-baseline.tsx` — Gets baseline training schedule data (from public/training.json)

### `src/models/`
Data models and business logic:
- `foodLog.ts` — FoodLog entity and calculations (calories, macros)
- `macronutrientGoals.ts` — MacronutrientGoals calculations based on weight and body fat percentage; determines daily calorie targets and macro splits
- `macronutrientSetup.ts` — Setup state for macronutrient goals (phase, adaptation cycles)
- `trainingAndMacronutritionSchedule.ts` — Training schedule model aligned with macronutrient phases (+trainingAndMacronutritionOnDay)
- Test files: `*.test.ts` and `*.adapt.test.ts` — unit tests for models (skip testing)

### `src/utils/`
Utility functions:
- `createDb.ts` — Persistence layer; initializes and manages IndexedDB
- `aggregateMacronutrients.ts` — Aggregates FoodLog[]
- `formatNumber.ts` - Returns 2 decimal numbers
- `localeISODate.ts` - current locale ISO date

### `src/assets/`
Static assets (icons, images, etc.)