(function () {
	const config = window.appConfig || {};
	const version = config.version || 'dev';
	const storagePrefix = 'easy-quran-telemetry-';

	function isEnabled()
	{
		return config.telemetryEnabled === true;
	}

	function todayKey(name)
	{
		return `${storagePrefix}${name}-${new Date().toISOString().slice(0, 10)}`;
	}

	function oncePerDay(name)
	{
		try {
			const key = todayKey(name);

			if (localStorage.getItem(key) === '1') {
				return false;
			}

			localStorage.setItem(key, '1');
			return true;
		} catch (error) {
			return false;
		}
	}

	function installationId()
	{
		try {
			const key = `${storagePrefix}installation-id`;
			let value = localStorage.getItem(key);

			if (!value) {
				value = crypto.randomUUID ? crypto.randomUUID() : randomId();
				localStorage.setItem(key, value);
			}

			return value;
		} catch (error) {
			return randomId();
		}
	}

	function randomId()
	{
		const bytes = new Uint8Array(16);
		crypto.getRandomValues(bytes);

		return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
	}

	function displayMode()
	{
		if (window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true) {
			return 'standalone';
		}

		if (window.matchMedia('(display-mode: fullscreen)').matches) {
			return 'fullscreen';
		}

		if (window.matchMedia('(display-mode: minimal-ui)').matches) {
			return 'minimal-ui';
		}

		return 'browser';
	}

	function language()
	{
		try {
			return localStorage.getItem('language') || navigator.language.split(/[_-]/)[0] || null;
		} catch (error) {
			return null;
		}
	}

	function send(path, payload)
	{
		const body = JSON.stringify(payload);

		if (navigator.sendBeacon) {
			const blob = new Blob([body], { type: 'application/json' });
			navigator.sendBeacon(path, blob);
			return;
		}

		fetch(path, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body,
			keepalive: true,
		}).catch(() => {});
	}

	function track(event)
	{
		if (!isEnabled()) {
			return;
		}

		send('/telemetry.php', {
			event,
			version,
			language: language(),
			displayMode: displayMode(),
		});
	}

	function checkPublisher()
	{
		if (!isEnabled() || !oncePerDay('publisher-check')) {
			return;
		}

		send('/publisher-check.php', {
			installationId: installationId(),
		});
	}

	function boot()
	{
		if (!isEnabled()) {
			return;
		}

		if (oncePerDay('app-open')) {
			track('app_open');
		}

		if (displayMode() !== 'browser' && oncePerDay('pwa-standalone')) {
			track('pwa_standalone');
		}

		checkPublisher();
	}

	window.addEventListener('appinstalled', () => {
		track('pwa_installed');
		checkPublisher();
	});

	window.addEventListener('error', () => {
		if (oncePerDay('app-error')) {
			track('app_error');
		}
	});

	window.easyQuranTelemetry = {
		track,
		checkPublisher,
	};

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', boot, { once: true });
	} else {
		boot();
	}
})();
