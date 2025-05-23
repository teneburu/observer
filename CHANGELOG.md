# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Initial project scaffolding with pnpm workspaces.
  - Created `pnpm-workspace.yaml`.
  - Created root `package.json` for the monorepo.
  - Created `packages` directory with sub-packages: `core`, `client`, and `server`.
- Basic `package.json` and `tsconfig.json` for `@observer/core`, `@observer/client`, and `@observer/server`.
- Placeholder `src/index.ts` files for each package.
- Installed initial dependencies for all packages.
- Root `.eslintrc.json` and `.prettierrc.json` for code linting and formatting.
- Installed ESLint, Prettier, and TypeScript dev dependencies at the root level.
- Implemented TypeScript project references for improved module resolution within the monorepo.
  - Created `tsconfig.base.json` in the root.
  - Updated package-specific `tsconfig.json` files to extend the base configuration and add project references.
  - Created a root `tsconfig.json` to reference all workspace packages.
- Added a comprehensive `.gitignore` file to the project root.
- Renamed `roadmap200525.md` to `ROADMAP.md`.
- Setup Vitest for testing:
  - Installed `vitest` and `@vitest/coverage-v8` as root dev dependencies.
  - Created `vitest.config.ts` in the root for monorepo configuration.
  - Added `"test": "pnpm -r test"` script to the root `package.json`.
  - Added `"test": "vitest run"` script to `packages/core/package.json`, `packages/client/package.json`, and `packages/server/package.json`.
- Setup VitePress for documentation:
  - Added `vitepress` as a root dev dependency.
  - Initialized VitePress in the `docs` directory with default theme and TypeScript support.
  - Added `docs:dev` and other related npm scripts to the root `package.json`.
- Defined initial common TypeScript types for `@observer/core` in `packages/@observer/core/src/types.ts`:
  - Includes types for core configuration (`ObserverConfig`, `ObserverServiceConfig`, `ObserverEnvironment`).
  - Includes base event structure (`ObserverBaseEvent`) and specific event types (`ObserverPageViewEvent`, `ObserverCustomEvent`, `ObserverErrorEvent`).
  - Added `eventSchemaVersion` to `ObserverBaseEvent` for event payload versioning.
  - Includes utility types for event payloads and capture functions.
- Standardized package directory naming convention to `packages/@observer/core`, `packages/@observer/client`, and `packages/@observer/server`.
- Corrected `tsconfig.json` paths (for `extends` and `references`) in all packages to align with the standardized directory structure and ensure correct project linking.
- Replaced `Record<string, any>` with `Record<string, unknown>` in `@observer/core/src/types.ts` for improved type safety. 