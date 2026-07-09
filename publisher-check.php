<?php

declare(strict_types=1);

$config = json_decode((string) file_get_contents(__DIR__ . '/app_config.json'), true);
$config = is_array($config) ? $config : [];
$publisher = is_array($config['publisher'] ?? null) ? $config['publisher'] : [];

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

if (($publisher['enabled'] ?? false) !== true) {
	http_response_code(204);
	exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
	http_response_code(405);
	echo json_encode(['ok' => false, 'message' => 'Method not allowed']);
	exit;
}

$payload = json_decode((string) file_get_contents('php://input'), true);

if (!is_array($payload)) {
	http_response_code(400);
	echo json_encode(['ok' => false, 'message' => 'Invalid JSON']);
	exit;
}

$installationId = (string) ($payload['installationId'] ?? '');

if (preg_match('/\A[a-f0-9-]{32,64}\z/i', $installationId) !== 1) {
	http_response_code(400);
	echo json_encode(['ok' => false, 'message' => 'Invalid installation id']);
	exit;
}

$latestUrl = (string) ($publisher['latestUrl'] ?? '');

if ($latestUrl === '') {
	http_response_code(204);
	exit;
}

$query = http_build_query([
	'product' => (string) ($config['productKey'] ?? 'easy-quran'),
	'channel' => (string) ($config['releaseChannel'] ?? 'stable'),
	'installed_version' => (string) ($config['version'] ?? 'dev'),
	'product_key' => (string) ($config['productKey'] ?? 'easy-quran'),
	'installation_id' => $installationId,
	'telemetry_schema_version' => (int) (($config['telemetry']['schemaVersion'] ?? 1)),
]);

$separator = strpos($latestUrl, '?') !== false ? '&' : '?';
$url = $latestUrl . $separator . $query;
$context = stream_context_create([
	'http' => [
		'method' => 'GET',
		'timeout' => 3,
		'header' => "Accept: application/json\r\nUser-Agent: EasyQuran/" . ((string) ($config['version'] ?? 'dev')) . "\r\n",
		'ignore_errors' => true,
	],
]);

$response = @file_get_contents($url, false, $context);
$status = 0;

if (isset($http_response_header) && is_array($http_response_header)) {
	foreach ($http_response_header as $header) {
		if (preg_match('/^HTTP\/\S+\s+(\d{3})/', $header, $matches)) {
			$status = (int) $matches[1];
			break;
		}
	}
}

if ($response === false || $status >= 500) {
	http_response_code(202);
	echo json_encode(['ok' => false, 'message' => 'Publisher check deferred']);
	exit;
}

http_response_code(200);
echo json_encode(['ok' => true, 'status' => $status]);
