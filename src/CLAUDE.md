## Structure

### `src/components/`
UI components for the food tracker:
- `TopMenu.tsx` — Header with menu actions
- `FoodLogsGroupedByDay.tsx` — Main view: displays food logs organized by date
- `FoodLogsGroupedByTime.tsx` — Alternative grouping by meal time
- `FoodLogRow.tsx` — Single food log entry row
- `FoodLogEntryDialog.tsx` — Modal for adding/editing food logs
- `ImportExportDialog.tsx` - Modal for importing/exporting the app's data
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

### `src/assets/`
Static assets (icons, images, etc.)