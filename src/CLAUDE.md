## Structure

### `src/components/`
UI components for the food tracker:
- `Navigation.tsx` — Header with menu actions
- `FoodTracker/` — FoodTracker feature components (see `FoodTracker/CLAUDE.md`)
- `*.stories.tsx` — Storybook files for component testing (skip testing)

### `src/context/`
React Context providers for shared state:
- `foods.tsx` — Manages available foods list (from public/foods.json)
- `foodLogs.tsx` — Manages user's food log entries (add, delete, query)

### `src/models/`
Data models and business logic:
- `foodLog.ts` — FoodLog entity and calculations (calories, macros)

### `src/utils/`
Utility functions:
- `createDb.ts` — Persistence layer; initializes and manages IndexedDB
- `aggregateMacronutrients.ts` — Aggregates FoodLog[]
- `formatNumber.ts` - Returns 2 decimal numbers
- `localeISODate.ts` - current locale ISO date

### `src/assets/`
Static assets (icons, images, etc.)