if ('serviceWorker' in navigator)
{
	const version = window.appConfig?.version ?? String(Date.now());
	const reloadGuardKey = `easy-quran-reloaded-${version}`;
	let refreshing = false;

	function getUpdateText(key)
	{
		const storedLanguage = localStorage.getItem('language');
		const browserLanguage = navigator.language.split(/[_-]/)[0];
		const language = window.translations?.[storedLanguage] ? storedLanguage : (window.translations?.[browserLanguage] ? browserLanguage : 'en');

		return window.translations?.[language]?.[key] ?? key;
	}

	function showUpdateBanner()
	{
		let banner = document.getElementById('pwa-update-banner');

		if (!banner) {
			banner = document.createElement('div');
			banner.id = 'pwa-update-banner';
			banner.setAttribute('role', 'status');
			banner.setAttribute('aria-live', 'polite');
			document.body.appendChild(banner);
		}

		banner.textContent = getUpdateText('updating-app');
		banner.classList.add('open');
	}

	function trackInstallingWorker(worker)
	{
		if (!worker) {
			return;
		}

		worker.addEventListener('statechange', () => {
			if (worker.state === 'installed' && navigator.serviceWorker.controller) {
				showUpdateBanner();
				worker.postMessage({ type: 'SKIP_WAITING' });
			}
		});
	}

	function registerServiceWorker()
	{
		navigator.serviceWorker.register(`/sw.js?v=${encodeURIComponent(version)}`).then(registration => {
			if (registration.waiting) {
				showUpdateBanner();
				registration.waiting.postMessage({ type: 'SKIP_WAITING' });
			}

			trackInstallingWorker(registration.installing);

			registration.addEventListener('updatefound', () => {
				trackInstallingWorker(registration.installing);
			});

			registration.update().catch(() => {});

			window.setInterval(() => {
				registration.update().catch(() => {});
			}, 60 * 60 * 1000);
		}).catch(() => {});
	}

	navigator.serviceWorker.addEventListener('controllerchange', () => {
		if (refreshing) {
			return;
		}

		refreshing = true;
		showUpdateBanner();

		if (sessionStorage.getItem(reloadGuardKey)) {
			return;
		}

		sessionStorage.setItem(reloadGuardKey, '1');
		window.location.reload();
	});

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', registerServiceWorker, { once: true });
	} else {
		registerServiceWorker();
	}
}
