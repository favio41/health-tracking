# Component Hierarchy

AppContent (src/index.tsx)
├── TopMenu
├── FoodLogsGroupedByDay
│   └── [day header row]
│       └── FoodLogsGroupedByTime
│           ├── [meal header row]
│           └── FoodLogRow
└── FoodLogEntryDialog


- **Story file imports**: `@storybook/preact-vite` for `Meta, StoryObj` (not `@storybook/preact`).
- **Story title**: `'Components/<Name>'`.
- **Mock data**: Redefine `Food` objects per-file (no shared fixtures); use `source: 'USDA' as const` (literal type needed).
- **Mock `FoodLog`**: Use `FoodLogModel` factory, never hand-build.
- **Patterns**: `Empty` story for list components. No decorators/providers used in existing stories (but `FoodLogEntryDialog` adds the first context-wrapping decorator for `FoodsProvider`).