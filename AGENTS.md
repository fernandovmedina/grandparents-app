# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Grandparents is an Expo / React Native (TypeScript) mobile app for elderly users. Each contact is a large photo mapped to a phone number; tapping the photo dials the number via `tel:`. Contacts are added/edited/deleted through simple icon-driven controls. Ships as Android APK (English and Spanish builds).

Runs on Expo SDK 54 (React 19.1, React Native 0.81, expo-router 6, react-navigation 7) — upgraded from SDK 51 in July 2026.

## Package manager: pnpm

**pnpm is the package manager** — `pnpm-lock.yaml` is the authoritative lockfile. Do not run `npm install` (a mixed `node_modules` makes pnpm shove packages into `node_modules/.ignored`).

- `pnpm-workspace.yaml` approves the `unrs-resolver` postinstall build script (`allowBuilds`). pnpm 11 blocks unapproved build scripts; if a new dependency needs one, approve it there rather than interactively.
- `pnpm run <script>` re-verifies deps before running, so an install problem surfaces as a failing `pnpm run start`.
- If pnpm claims a published version "does not exist" that `npm view` can see, the metadata cache at `~/Library/Caches/pnpm/v11/metadata` is stale — clear it.

## Commands

```bash
pnpm install         # install dependencies
pnpm start           # start Metro / dev server (expo start)
pnpm android         # start on Android
pnpm ios             # start on iOS
pnpm web             # start on web
pnpm test            # jest in --watchAll mode (preset: jest-expo)
pnpm lint            # expo lint
```

There are currently no test files in the repo. Builds are produced with EAS (`eas build`); profiles are defined in `eas.json` (`preview` → APK, plus `production`).

## Architecture

Routing uses **expo-router** (file-based, with `typedRoutes` enabled). The `@/*` path alias maps to the project root.

Screens:
- `app/_layout.tsx` — root `Stack` wrapping `(tabs)`, `add`, and `edit`. Wrapped in `DarkTheme`; headers are hidden. Loads the SpaceMono font before hiding the splash screen.
- `app/(tabs)/index.tsx` — home grid (3-column `FlatList` of contact photos). Hosts a custom top nav bar (home / add / edit / delete icons) and holds `editingMode` / `deletingMode` toggle state that reveals per-item EDIT/DELETE buttons.
- `app/add.tsx` — pick an image (`expo-image-picker`) + enter a phone number, then save.
- `app/edit.tsx` — edit an existing contact's image URI and phone; reached via `navigation.navigate('edit', { person })`.

### State model — important

There is **no React/global state store**. `constants/Person.ts` exports a single module-level mutable array `persons: Person[]` that every screen imports and mutates directly (`persons.push(...)`, `persons.length = 0`, index assignment). Persistence is manual: after any mutation, call `savePersonsToStorage()` (writes the array to AsyncStorage under the key `"persons"`), and `loadPersonsFromStorage()` rehydrates it (called once in the home screen's `useEffect`).

Consequences to keep in mind when editing:
- Mutating `persons` does **not** trigger re-renders. UI updates rely on navigation/remount, which is why some changes only appear after leaving and returning to a screen.
- `Person` uses backing fields `_id` / `_phone` with getters/setters (`id`, `phone`), plus a plain `src` field. Serialization/deserialization in `Person.ts` depends on these exact field names — preserve them when changing the shape.
- New IDs are assigned as `persons.length + 1`, so IDs are not stable across deletions.

## Known issues (from README)

- An unwanted bottom navigation bar appears on the home screen (`(tabs)` layout).
- After using EDIT or DELETE mode, the toggle must be pressed again before the app behaves normally (mode state isn't reset after an action).

# Repo Notes

- Upgraded the app from Expo SDK 51 to Expo SDK 54 (July 2026): `expo@~54.0.35`, `react@19.1.0`, `react-native@0.81.5`, `expo-router@~6.0.24`, `@react-navigation/native@^7.1.8`.
- Migrated the repo from npm to pnpm (July 2026): `pnpm-lock.yaml` regenerated via `pnpm import` from the validated npm tree, then `package-lock.json` was removed. `pnpm-lock.yaml` is the only lockfile.
- `pnpm-workspace.yaml` approves the `unrs-resolver` build script (`allowBuilds`) — required for `pnpm run <script>` to pass pnpm 11's pre-run dependency verification.
- Validated post-migration: `pnpm run start` boots Metro and serves a complete Android dev bundle (1457 modules, no errors).
