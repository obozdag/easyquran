# Easy Quran
Easy Quran is a progressive web application. You can read on web page and install on your mobile device.

After installing without internet connection it can run offline.

Current version: v1.94.04

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

When releasing a new version:

1. Update `version` in `app_config.json`.
2. Add an entry to `CHANGELOG.md`.
3. Confirm the footer shows the new version.

## PWA Notes

The service worker keeps the application shell in a versioned cache and stores runtime responses separately. Navigation requests try the network first and fall back to the cached `index.php` when offline.

For feature requests or any bug reports please send email to info at fklavye dot net

That is an open source project. You can freely modify it on [github](https://github.com/obozdag/easyquran)
