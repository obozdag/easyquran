<?php

declare(strict_types=1);

$config = json_decode((string) file_get_contents(__DIR__ . '/app_config.json'), true);

if (!is_array($config)) {
	$config = [];
}

header('Content-Type: application/javascript; charset=utf-8');
header('Cache-Control: no-cache, no-store, must-revalidate');

echo 'self.EASY_QURAN_CONFIG = ';
echo json_encode($config, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
echo ';';
