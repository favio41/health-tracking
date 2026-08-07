## Structure

### Components
- `index.tsx` — Main file. Displays training start date status and "Set Training Start Date" button. Manages dialog state.
- `TrainingStartDateDialog.tsx` — Modal dialog for selecting and saving the training start date. Consumes `useSettings()` to read current date and update settings on save.
- `WeekGrid` - Grid with calendar training exercises
- `*.stories.tsx` — Storybook stories

### State & Context
Uses `SettingsContext` (from `src/context/settings.tsx`) for managing the training start date setting.
