# Changelog

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
