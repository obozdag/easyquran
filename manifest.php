<?php

declare(strict_types=1);

// Serves the PWA manifest with icon cache-busting derived from the single
// version source in app_config.json. The static easy_quran.json is a
// version-free template; this script injects `?v=<version>` into every icon so
// the version lives in exactly one place (mirrors app-config.php, which emits
// the service worker config from the same app_config.json).

$config = json_decode((string) file_get_contents(__DIR__ . '/app_config.json'), true);
$config = is_array($config) ? $config : [];

$version = isset($config['version']) && trim((string) $config['version']) !== ''
	? trim((string) $config['version'])
	: 'dev';

$manifest = json_decode((string) file_get_contents(__DIR__ . '/easy_quran.json'), true);
$manifest = is_array($manifest) ? $manifest : [];

$versionQuery = '?v=' . rawurlencode($version);

$withVersion = static function (array $icons) use ($versionQuery): array {
	foreach ($icons as &$icon) {
		if (isset($icon['src']) && is_string($icon['src'])) {
			$icon['src'] .= $versionQuery;
		}
	}
	unset($icon);

	return $icons;
};

if (isset($manifest['icons']) && is_array($manifest['icons'])) {
	$manifest['icons'] = $withVersion($manifest['icons']);
}

if (isset($manifest['shortcuts']) && is_array($manifest['shortcuts'])) {
	foreach ($manifest['shortcuts'] as &$shortcut) {
		if (isset($shortcut['icons']) && is_array($shortcut['icons'])) {
			$shortcut['icons'] = $withVersion($shortcut['icons']);
		}
	}
	unset($shortcut);
}

header('Content-Type: application/manifest+json; charset=utf-8');
header('Cache-Control: no-cache, no-store, must-revalidate');

echo json_encode($manifest, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
