# Changelog

## v1.94.08 - 2026-07-10

- Made `app_config.json` the single source of the version. The PWA manifest is now served by `manifest.php` (which reads `app_config.json` and injects the version into icon URLs), and `easy_quran.json` became a version-free template. Bumping the version in `app_config.json` now propagates to the page, service worker caches, and manifest icons with no other edits.

## v1.94.07 - 2026-07-07

- Added privacy-preserving daily aggregate telemetry for app opens, PWA installs, standalone launches, update readiness, and coarse error counts.
- Added a same-origin Publisher latest-check proxy for anonymous active-install telemetry without exposing user IPs to Publisher.
- Added Publisher-compatible release artifact preparation and publish tooling with checksum validation and dry-run support.
- Documented the release workflow, privacy contract, Publisher usage, and deployment verification steps.

## v1.94.06 - 2026-06-20

- Added separate padded maskable PWA icons and a dedicated iOS touch icon.
- Versioned the manifest link, manifest icon URLs, app CSS/JS assets, and service worker app-shell entries.
- Scoped service worker cache cleanup to Easy Quran caches and kept auto-activation enabled.
- Added startup service worker update checks with a one-time reload guard.
- Added a compact localized update banner sourced from `js/lang.js` without a manual Reload button.

## v1.94.05 - 2026-06-14

- Renamed the default branch from `master` to `main`.
- Removed the merged PWA feature branch after release.
- Removed the old remote `master` branch so only `main` remains.
- Switched the local `origin` remote to SSH for reliable push and fetch operations.
- Documented the branch cleanup and release workflow in the README.

## v1.94.04 - 2026-06-14

- Added a single application config source for program metadata and versioning.
- Updated the service worker to use versioned app-shell and runtime caches.
- Improved offline handling for navigation and cached assets.
- Removed a stale service worker cache entry for a missing settings file.
- Modernized the PWA manifest with app id, scope, language, direction, standalone display, maskable icons, and a shortcut.
- Deferred JavaScript loading to improve initial rendering.
- Improved accessibility by using button controls with ARIA labels for navigation and popup actions.
- Escaped dynamic PHP output and fixed the footer link markup.
- Updated the footer to show the current application version.
