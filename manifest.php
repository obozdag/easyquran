<?php

declare(strict_types=1);

// Serves the PWA manifest with an icon revision that is intentionally
// independent from the application version. Changing a manifest icon URL is
// treated as an app identity change by Android/Chrome and can require explicit
// user approval, so iconVersion must only change when the icon really changes.

$config = json_decode((string) file_get_contents(__DIR__ . '/app_config.json'), true);
$config = is_array($config) ? $config : [];

$iconVersion = isset($config['iconVersion']) && trim((string) $config['iconVersion']) !== ''
	? trim((string) $config['iconVersion'])
	: (isset($config['version']) && trim((string) $config['version']) !== ''
		? trim((string) $config['version'])
		: 'dev');

$manifest = json_decode((string) file_get_contents(__DIR__ . '/easy_quran.json'), true);
$manifest = is_array($manifest) ? $manifest : [];

$versionQuery = '?v=' . rawurlencode($iconVersion);

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
