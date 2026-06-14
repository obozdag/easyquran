importScripts('/app-config.php');

const version = self.EASY_QURAN_CONFIG?.version ?? 'dev';
const APP_SHELL_CACHE = `easy-quran-app-shell-v${version}`;
const RUNTIME_CACHE = `easy-quran-runtime-v${version}`;

const staticContentToCache = [
	'app.js',
	'app-config.php',
	'css/easy_quran.css',
	'css/fonts.css',
	'css/fonts/EasyArabic.ttf',
	'css/fonts/Lateef.ttf',
	'css/fonts/rb.ttf',
	'css/icons/easy_quran_128x128.png',
	'css/icons/easy_quran_144x144.png',
	'css/icons/easy_quran_152x152.png',
	'css/icons/easy_quran_192x192.png',
	'css/icons/easy_quran_32x32.png',
	'css/icons/easy_quran_384x384.png',
	'css/icons/easy_quran_48x48.png',
	'css/icons/easy_quran_512x512.png',
	'css/icons/easy_quran_64x64.png',
	'css/icons/easy_quran_72x72.png',
	'css/icons/easy_quran_96x96.png',
	'css/icons/loading.gif',
	'css/rb.css',
	'favicon.ico',
	'easy_quran.json',
	'index.php',
	'js/defaults.js',
	'js/easy_quran.js',
	'js/lang.js',
	'js/swipe.js',
	'languages/en/program_info.php',
	'languages/tr/program_info.php',
];

function normalizeCacheKey(request)
{
	const url = new URL(request.url);
	return `${url.pathname.slice(1)}${url.search}`;
}

function isCacheableRequest(request)
{
	const url = new URL(request.url);
	return url.protocol === 'http:' || url.protocol === 'https:';
}

function canStoreResponse(response)
{
	return response && response.ok;
}

function storeResponse(cache, key, response)
{
	if (canStoreResponse(response)) {
		cache.put(key, response.clone()).catch(() => {});
	}
}

function isAppShellRequest(request)
{
	const url = new URL(request.url);
	return url.origin === self.location.origin && staticContentToCache.includes(normalizeCacheKey(request));
}

async function warmAppShellCache(cache)
{
	await Promise.allSettled(staticContentToCache.map(async file => {
		const response = await fetch(file, { cache: 'reload' });

		if (canStoreResponse(response)) {
			await cache.put(file, response);
		}
	}));
}

async function handleNavigation(request)
{
	const cache = await caches.open(APP_SHELL_CACHE);

	try {
		const response = await fetch(request);
		storeResponse(cache, 'index.php', response);
		return response;
	} catch (error) {
		const cachedResponse = await cache.match('index.php');

		return cachedResponse ?? new Response('', {
			status: 503,
			statusText: 'Offline',
		});
	}
}

// Installing Service Worker
self.addEventListener('install', evt => {
	evt.waitUntil(
		caches.open(APP_SHELL_CACHE)
			.then(cache => warmAppShellCache(cache))
			.then(() => self.skipWaiting()),
	);
});

// Activating Service Worker
self.addEventListener('activate', evt => {
	evt.waitUntil(
		caches.keys()
			.then(keys => Promise.all(
				keys
					.filter(key => key !== APP_SHELL_CACHE && key !== RUNTIME_CACHE)
					.map(key => caches.delete(key)),
			))
			.then(() => self.clients.claim()),
	);
});

self.addEventListener('message', evt => {
	if (evt.data?.type === 'SKIP_WAITING') {
		self.skipWaiting();
	}
});

// Fetching content using Service Worker
self.addEventListener('fetch', evt => {
	if (evt.request.method !== 'GET' || !isCacheableRequest(evt.request)) {
		return;
	}

	if (evt.request.mode === 'navigate') {
		evt.respondWith(handleNavigation(evt.request));
		return;
	}

	if (isAppShellRequest(evt.request)) {
		evt.respondWith(
			caches.open(APP_SHELL_CACHE).then(async cache => {
				const cacheKey = normalizeCacheKey(evt.request);
				const cachedResponse = await cache.match(cacheKey);

				if (cachedResponse) {
					return cachedResponse;
				}

				try {
					const response = await fetch(evt.request);
					storeResponse(cache, cacheKey, response);
					return response;
				} catch (error) {
					return new Response('', {
						status: 503,
						statusText: 'Offline',
					});
				}
			}),
		);
		return;
	}

	evt.respondWith(
		caches.open(RUNTIME_CACHE).then(async cache => {
			try {
				const response = await fetch(evt.request);
				storeResponse(cache, evt.request, response);
				return response;
			} catch (error) {
				const cachedResponse = await cache.match(evt.request);

				return cachedResponse ?? new Response('', {
					status: 503,
					statusText: 'Offline',
				});
			}
		}),
	);
});
