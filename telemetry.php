<?php

declare(strict_types=1);

$config = json_decode((string) file_get_contents(__DIR__ . '/app_config.json'), true);
$config = is_array($config) ? $config : [];
$telemetry = is_array($config['telemetry'] ?? null) ? $config['telemetry'] : [];

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

if (($telemetry['enabled'] ?? false) !== true) {
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

$allowedEvents = [
	'app_open',
	'app_error',
	'pwa_installed',
	'pwa_standalone',
	'pwa_update_ready',
];

$event = clean_dimension($payload['event'] ?? '', 40);

if (!in_array($event, $allowedEvents, true)) {
	http_response_code(400);
	echo json_encode(['ok' => false, 'message' => 'Unknown event']);
	exit;
}

$project = clean_dimension($config['productKey'] ?? 'easy-quran', 80);
$version = clean_dimension($payload['version'] ?? ($config['version'] ?? 'dev'), 40);
$language = clean_language($payload['language'] ?? null);
$displayMode = clean_display_mode($payload['displayMode'] ?? null);
$date = gmdate('Y-m-d');
$now = gmdate('Y-m-d H:i:s');

try {
	$databasePath = __DIR__ . '/data/telemetry.sqlite';
	$databaseDirectory = dirname($databasePath);

	if (!is_dir($databaseDirectory) && !mkdir($databaseDirectory, 0755, true) && !is_dir($databaseDirectory)) {
		throw new RuntimeException('Telemetry directory is not writable.');
	}

	$pdo = new PDO('sqlite:' . $databasePath);
	$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$pdo->exec(
		'CREATE TABLE IF NOT EXISTS telemetry_daily (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			date TEXT NOT NULL,
			project TEXT NOT NULL,
			version TEXT NOT NULL,
			event TEXT NOT NULL,
			language TEXT,
			display_mode TEXT,
			count INTEGER NOT NULL DEFAULT 0,
			created_at TEXT NOT NULL,
			updated_at TEXT NOT NULL,
			UNIQUE(date, project, version, event, language, display_mode)
		)'
	);

	$statement = $pdo->prepare(
		'INSERT INTO telemetry_daily
			(date, project, version, event, language, display_mode, count, created_at, updated_at)
		 VALUES
			(:date, :project, :version, :event, :language, :display_mode, 1, :created_at, :updated_at)
		 ON CONFLICT(date, project, version, event, language, display_mode)
		 DO UPDATE SET count = count + 1, updated_at = excluded.updated_at'
	);

	$statement->execute([
		'date' => $date,
		'project' => $project,
		'version' => $version,
		'event' => $event,
		'language' => $language,
		'display_mode' => $displayMode,
		'created_at' => $now,
		'updated_at' => $now,
	]);

	echo json_encode(['ok' => true]);
} catch (Throwable $exception) {
	http_response_code(500);
	echo json_encode(['ok' => false, 'message' => 'Telemetry unavailable']);
}

function clean_dimension($value, int $maxLength): string
{
	$value = trim((string) $value);
	$value = preg_replace('/[^A-Za-z0-9._-]/', '', $value) ?? '';

	return substr($value, 0, $maxLength) ?: 'unknown';
}

function clean_language($value): ?string
{
	if (!is_string($value) || trim($value) === '') {
		return null;
	}

	$value = strtolower(substr(trim($value), 0, 12));

	return preg_match('/\A[a-z]{2,3}(-[a-z]{2})?\z/', $value) === 1 ? $value : null;
}

function clean_display_mode($value): ?string
{
	if (!is_string($value)) {
		return null;
	}

	return in_array($value, ['browser', 'standalone', 'fullscreen', 'minimal-ui'], true) ? $value : 'unknown';
}
