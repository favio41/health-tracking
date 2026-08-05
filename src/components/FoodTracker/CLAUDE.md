## Structure

### Components
- `FoodLogsGroupedByDay.tsx` — Main view: displays food logs organized by date with daily totals
- `FoodLogsGroupedByTime.tsx` — Alternative grouping by meal time (breakfast, lunch, dinner, snacks)
- `FoodLogRow.tsx` — Single food log entry row with macronutrient display
- `FoodLogEntryDialog.tsx` — Modal for adding/editing food logs with food search and quantity input
- `ImportExportDialog.tsx` — Modal for importing/exporting the app's data

### State & Context
Uses `FoodLogsContext` (from `src/context/foodLogs.tsx`) for managing food log entries and `FoodsContext` (from `src/context/foods.tsx`) for available foods list.

## Key Features
- Add/edit/delete food log entries
- Search foods by name
- Calculate and display calories and macronutrients
- Toggle between day/time-based views
- Import/export data