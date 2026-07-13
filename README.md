# Easy Quran
Easy Quran is a progressive web application. You can read on web page and install on your mobile device.

After installing without internet connection it can run offline.

Current version: v1.94.09

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
- Privacy-preserving anonymous usage telemetry
- Publisher-compatible release artifact workflow

## Versioning

Application metadata is stored in `app_config.json`. The PHP page, JavaScript service worker registration, and service worker cache names all read the application version from this single source. Manifest icons use the separate `iconVersion` so routine releases do not appear to Android/Chrome as app identity changes.

The repository uses `main` as its default branch. Temporary feature branches should be merged and deleted after release so the remote stays focused on the current production line.

When releasing a new version:

1. Update `version` in `app_config.json`.
2. Add an entry to `CHANGELOG.md`.
3. Confirm the footer shows the new version.
4. Keep app CSS/JS query strings and the service worker cache revision synchronized with `version`.
5. Change `iconVersion` only when the icon artwork actually changes; this intentionally triggers an Android/Chrome identity-update review.
6. Preserve the normal, maskable, and iOS icon split. Maskable icons should use an opaque white canvas with safe-area padding, and `apple-touch-icon.png` should remain a separate padded iOS icon.
7. Run `php scripts/release.php check`, `php scripts/release.php prepare`, and `php scripts/release.php publish --dry-run`.

Release artifacts can be published to WebBlocks Publisher with `php scripts/release.php publish`. The script reads `WEBBLOCKS_PUBLISHER_URL`, `WEBBLOCKS_PUBLISHER_TOKEN`, `WEBBLOCKS_PUBLISHER_PRODUCT`, and `WEBBLOCKS_PUBLISHER_CHANNEL` from a local ignored `.env` file when present. Publisher is used for artifact hosting, checksums, release history, downloads, update-check totals, and anonymous active-install telemetry; the PWA itself still updates through the service worker.

See `docs/release-workflow.md` for the full publish and deploy workflow.

For live website deployment, `scripts/publish-rsync.sh --dry-run` validates the release and rsyncs only files present in the prepared release artifact. Add `EASY_QURAN_DEPLOY_HOST`, `EASY_QURAN_DEPLOY_SSH_PORT`, and `EASY_QURAN_DEPLOY_PUBLIC_ROOT` to the local ignored `.env` file before using it.

## Telemetry

Easy Quran records only low-risk maintenance telemetry: daily aggregate app opens, PWA installs, standalone launches, update readiness, and coarse error counts. It does not store IP addresses, raw user agents, request logs, reading choices, bookmarks, sura/page/ayah activity, locations, emails, or device identifiers.

`telemetry.php` stores local daily counters in `data/telemetry.sqlite`, which is ignored by Git. `publisher-check.php` sends a once-per-day Publisher latest check with product, channel, installed version, telemetry schema version, and a random local installation ID; Publisher stores only a product/channel-scoped hash of that ID.

## PWA Notes

The service worker keeps the application shell in a versioned cache and stores runtime responses separately. Navigation requests try the network first and fall back to the cached `index.php` when offline.

Update banner text comes from `js/lang.js`. The automatic reload flow shows a short localized status message and does not render a manual Reload button.

App content and cache normally update through the service worker flow. Launcher icon updates for existing Android/iOS home screen shortcuts are controlled by the operating system; removing and reinstalling the shortcut is only a test or last-resort step.

If an older app shell appears after deployment, refresh once after the new service worker activates or open the app with a temporary cache-busting query string.

For feature requests or any bug reports please send email to info at fklavye dot net

That is an open source project. You can freely modify it on [github](https://github.com/obozdag/easyquran)
