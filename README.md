# Easy Quran
Easy Quran is a progressive web application. You can read on web page and install on your mobile device.

After installing without internet connection it can run offline.

Current version: v1.94.06

## Features

- Easy to read
- Easy to use
- Scrolls top-to-bottom not left to right
- Installable
- Runs offline
- Runs on web and mobile
- Lightweight (about 2MB)
- Lightening fast
- Sura selection
- Juz selection
- Page selection
- Shortcuts to most read suras
- Font family selection
- Font size selection
- Color selection
- Background color selection
- Bookmark juz or page
- Printable (press Ctrl+P)
- Uses SQLite as database
- Versioned app-shell cache for more reliable PWA updates
- Accessible navigation and popup controls

## Versioning

Application metadata is stored in `app_config.json`. The PHP page, JavaScript service worker registration, and service worker cache names all read the version from this single source.

The repository uses `main` as its default branch. Temporary feature branches should be merged and deleted after release so the remote stays focused on the current production line.

When releasing a new version:

1. Update `version` in `app_config.json`.
2. Add an entry to `CHANGELOG.md`.
3. Confirm the footer shows the new version.
4. Keep the manifest link, manifest icon `?v=` values, app CSS/JS query strings, and service worker cache revision synchronized with the same version.
5. Preserve the normal, maskable, and iOS icon split. Maskable icons should use an opaque white canvas with safe-area padding, and `apple-touch-icon.png` should remain a separate padded iOS icon.

## PWA Notes

The service worker keeps the application shell in a versioned cache and stores runtime responses separately. Navigation requests try the network first and fall back to the cached `index.php` when offline.

Update banner text comes from `js/lang.js`. The automatic reload flow shows a short localized status message and does not render a manual Reload button.

App content and cache normally update through the service worker flow. Launcher icon updates for existing Android/iOS home screen shortcuts are controlled by the operating system; removing and reinstalling the shortcut is only a test or last-resort step.

If an older app shell appears after deployment, refresh once after the new service worker activates or open the app with a temporary cache-busting query string.

For feature requests or any bug reports please send email to info at fklavye dot net

That is an open source project. You can freely modify it on [github](https://github.com/obozdag/easyquran)
