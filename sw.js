var cacheName = 'EasyQuran v1.92'
var staticContentToCache = [
	'index.html',
	'favicon.ico',
	'css/easy_quran.css',
	'css/fonts/hamdullah.ttf',
	'css/fonts/lateef.ttf',
	'css/fonts/rb_icons.ttf',
	'css/icons/quran_32x32.png',
	'css/icons/quran_48x48.png',
	'css/icons/quran_64x64.png',
	'css/icons/quran_72x72.png',
	'css/icons/quran_96x96.png',
	'css/icons/quran_128x128.png',
	'css/icons/quran_144x144.png',
	'css/icons/quran_152x152.png',
	'css/icons/quran_192x192.png',
	'css/icons/quran_384x384.png',
	'css/icons/quran_512x512.png',
	'css/icons/loading.gif',
	'app.js',
	'js/swipe.js',
	'js/lang.js',
	'js/settings.js',
	'js/easy_quran.js',
	'languages/en/program_info.html',
	'languages/tr/program_info.html',
]

// Installing Service Worker
self.addEventListener('install', evt => {
	evt.waitUntil(
		caches.open(cacheName).then(cache => {
			return staticContentToCache.forEach(function(file){
				cache.add(file).catch(err => console.log(err+file))
			})
		})
		.then(function(){return self.skipWaiting()})
	)})

// Activating Service Worker
self.addEventListener('activate', evt => {
	evt.waitUntil(
		caches.keys().then(keys => {
			return Promise.all(keys
				.filter(key => key !== cacheName)
				.map(key => caches.delete(key))
			)
	}))})


// Fetching content using Service Worker
self.addEventListener('fetch', evt => {
	evt.respondWith(
		caches.match(evt.request).then(
			cacheResponse => {
				return cacheResponse || fetch(evt.request);
		}))
	})
