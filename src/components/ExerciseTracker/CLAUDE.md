## Structure

### Components
- `index.tsx` — Main file. Displays training start date status and "Set Training Start Date" button. Manages dialog state.
- `TrainingStartDateDialog.tsx` — Modal dialog for selecting and saving the training start date. Consumes `useSettings()` to read current date and update settings on save.
- `MonthlyGrid.tsx` — 5-week grid of training schedule cells. Renders each day's phase, training type, and nutrition option. Cells are clickable (via button elements) to open `DayDetailDialog`.
- `DayDetailDialog.tsx` — Modal dialog showing full details for a selected day (date, phase, training, nutrition, macronutrient goals). Includes a toggle button to mark the day as "skipped" via `useTrainingDaysLog()`.
- `*.stories.tsx` — Storybook stories

### State & Context
Uses `SettingsContext` (from `src/context/settings.tsx`) for managing the training start date setting.
