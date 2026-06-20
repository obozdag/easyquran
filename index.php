<?php
	$app_config  = json_decode((string) file_get_contents(__DIR__ . '/app_config.json'), true);
	$app_config  = is_array($app_config) ? $app_config : [];
	$prg_name    = $app_config['programName'] ?? 'Easy Quran';
	$version     = $app_config['version'] ?? 'dev';
	$version_tag = $version === 'dev' ? 'dev' : 'v' . $version;
	$color       = $app_config['color'] ?? '#008b8b';
	$canonical   = $app_config['canonicalUrl'] ?? 'https://quran.fklavye.net';
	$repository  = $app_config['repositoryUrl'] ?? 'https://github.com/obozdag/easyquran';
	$asset_v     = rawurlencode($version);
	$pdo         = new PDO('sqlite:db/quran.db');
	$rows_sura   = $pdo->query('SELECT * FROM fkl_sura');
	$rows_verse  = $pdo->query('SELECT v.*, s.name AS sura_name, s.tr AS sura_tr, s.en AS sura_en, s.basmala, s.verses, s.sajdah AS sura_sajdah FROM fkl_verse v INNER JOIN fkl_sura s ON s.id = v.sura_id');

	function e($value): string
	{
		return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
	}
?>
<!DOCTYPE html>
<html lang="ar">
<head>
	<title>Easy Quran</title>
	<meta charset="utf-8">
	<meta name="description" content="Easy Quran, easy to read, easy to scroll (top-to-bottom), lightweight (2.7MB), lightning fast, multi language, responsive, progressive web app.">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="apple-mobile-web-app-status-bar" content="<?= e($color) ?>">
	<meta name="theme-color" content="<?= e($color) ?>">
	<link rel="canonical" href="<?= e($canonical) ?>">
	<link rel="preload" href="/css/fonts/EasyArabic.ttf" as="font" crossorigin>
	<link rel="preload" href="/css/fonts/rb.ttf" as="font" crossorigin>
	<link rel="stylesheet" type="text/css" href="/css/easy_quran.css?v=<?= e($asset_v) ?>">
	<link rel="apple-touch-icon" href="/css/icons/apple-touch-icon.png?v=<?= e($asset_v) ?>">
	<link rel="manifest" href="/easy_quran.json?v=<?= e($asset_v) ?>">
	<script type="text/javascript">
		window.appConfig = {
			programName: '<?= e($prg_name) ?>',
			version: '<?= e($version) ?>',
			versionLabel: '<?= e($version_tag) ?>'
		};
		var prg_name = window.appConfig.programName;
		var version  = window.appConfig.versionLabel;
	</script>
	<script defer src="/js/swipe.js?v=<?= e($asset_v) ?>"></script>
	<script defer src="/js/lang.js?v=<?= e($asset_v) ?>"></script>
	<script defer src="/js/defaults.js?v=<?= e($asset_v) ?>"></script>
	<script defer src="/js/easy_quran.js?v=<?= e($asset_v) ?>"></script>
	<script defer src="/app.js?v=<?= e($asset_v) ?>"></script>
</head>
<body>
	<div id="loading-overlay">
		<div id="loading-content">
			<h3>Easy Quran</h3>
			<p><img src="/css/icons/loading.gif"></p>
			<p>Loading...</p>
			<p>quran.fklavye.net</p>
		</div>
	</div>
	<nav id="nav-top">
		<button type="button" id="open-nav-left" class="nav-top-btn rb-book-quran" title="Nav Left" aria-label="Open navigation"></button>
		<button type="button" id="program-info-btn" class="nav-top-btn rb-easyquran-solid" title="Program Info" aria-label="Program info"></button>
		<button type="button" id="top-btn" class="nav-top-btn rb-up" title="Top" aria-label="Scroll to top"></button>
		<button type="button" id="bottom-btn" class="nav-top-btn rb-down" title="Bottom" aria-label="Scroll to bottom"></button>
		<span>
			<button type="button" id="bookmark-list-btn" class="nav-top-btn rb-bookmark" title="Bookmark" aria-label="Bookmarks"></button>
			<span id="bookmark-container"></span>
		</span>
		<button type="button" id="open-nav-right" class="nav-top-btn rb-slider" title="Nav Right" aria-label="Open settings"></button>
	</nav>
	<nav id="nav-left" class="nav-side">
		<button type="button" class="close-btn right rb-circle-xmark" id="close-nav-left" aria-label="Close navigation"></button>
		<div class="settings">
			<h3><i class="logo rb-easyquran-solid"></i> <?= e($prg_name) ?></h3>
			<h4 class="nav-header"></h4>
			<div class="row">
				<label id="sura-list-label"></label>
				<div class="flex">
					<select id="sura-list" class="mr-1">
						<?php
						// foreach ($rows_sura as $row):
						// 	$id     = $row['id'];
						// 	$sajdah = $row['sajdah'] ? '*': '';
						// 	$option = $row['en'].' '.$id.' ('.$row['verses'].')'.$sajdah;
						// 	echo "<option value=\"s{$id}\">{$option}</option>\n";
						// endforeach;
						?>
					</select>
					<button type="button" class="btn btn-nav mr-1" id="sura-az-order" title="Order by Sura Name"><i class="rb-arrow-down-a-z"></i></button>
					<button type="button" class="btn btn-nav" id="sura-id-order"><i class="rb-arrow-down-123" title="Order by Sura Number"></i></button>
				</div>
			</div>
			<div class="row">
				<label id="juz-list-label"></label>
				<select id="juz-list">
					<option></option>
				</select>
			</div>
			<div class="row">
				<label id="page-input-label"></label>
				<span class="goto-page-container">
					<input type="text" id="page-no" size="3" min="0" max="604" maxlength="3" pattern="\d{1,3}" title="Sayfa numarası 0-604">
					<button type="button" class="btn btn-nav" id="goto-page-btn"></button>
				</span>
			</div>
			<div class="row" id="sura-shortcuts-row">
				<label id="sura-shortcuts-label"></label>
				<div id="sura-shortcuts-container">
					<ul id="sura-shortcuts">
					</ul>
				</div>
			</div>
		</div>
	</nav>
	<nav id="nav-right" class="nav-side">
		<button type="button" class="close-btn left rb-circle-xmark" id="close-nav-right" aria-label="Close settings"></button>
		<h3><i class="logo rb-easyquran-solid"></i> <?= e($prg_name) ?></h3>
		<h4 class="nav-header" id="settings-header"></h4>
		<div class="settings">
			<div class="row">
				<label id="font-family-list-label"></label>
				<select id="font-family-list"></select>
			</div>
			<div class="row">
				<label id="font-size-list-label"></label>
				<select id="font-size-list"></select>
			</div>
			<div class="row">
				<label id="color-list-label"></label>
				<select id="color-list"></select>
			</div>
			<div class="row">
				<label id="bg-color-list-label"></label>
				<select id="bg-color-list"></select>
			</div>
			<div class="row">
				<label id="language-list-label"></label>
				<select id="language-list"></select>
			</div>
			<div class="row">
				<label></label>
				<button type="button" class="btn btn-nav" id="reset-btn"></button>
			</div>
			<div id="nav-loading" class="nav-loading">
				<p id="settings-message"></p>
			</div>
		</div>
	</nav>
	<div class="container" id="quran-container">
		<div id="quran-verses" class="arabic">
		<?php	foreach($rows_verse as $row): ?>
		<?php
			$page        = $row['page'];
			$sura_sajdah = $row['sura_sajdah'] ? '*': '';
			$sura_info   = ' ('.$row['verses'].')'.$sura_sajdah;
		?>
			<?php if($page !== null): ?>
				<?php if($page > 0): ?>
				</section>
				<?php endif; ?>
			<section class="page">
			<?php 
			$page_anchor_label      = 's '.$page;
			$page_anchor_data_label = 's'.$page;
			$page_anchor_href       = 'p'.$page;
			$page_info              = $row['sura_id'].' '.$row['sura_tr'].' '.$sura_info.' ['.$row['juz'].'. cz '.$row['hizb'].'. hzb '.$row['hizb_page'].'. syf'.']';
			?>
			<p class="pip">
			<?php if($row['new_juz']): ?>
			<?php $juz_anchor_label = 'Cüz '.$row['new_juz']; ?>
			<?php $juz_anchor_href  = 'j'.$row['new_juz']; ?>
				<i class="ca" id="<?= e($juz_anchor_href) ?>"><?= e($juz_anchor_label) ?></i>
			<?php endif; ?>
				<i class="pa" id="<?= e($page_anchor_href) ?>" ><?= e($page_anchor_label) ?></i>
				<i class="ib rb-circle-info"></i>
				<i class="pi"><?= e($page_info) ?></i>
			</p>
			<?php endif; ?>
			<?php if ($row['new_sura']): ?>
			<?php $sura_href   = 's'.$row['sura_id']; ?>
			<?php $sura_header = $row['sura_id'].' '.$row['sura_tr'].$sura_info.' سُورَةُ '.$row['sura_name']; ?>
			<h4 class="sn" id="<?= e($sura_href) ?>"><?= e($sura_header) ?></h4>
				<?php if ($row['basmala']): ?>
				<p class="basmala">بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحٖيمِ</p>
				<?php endif; ?>
			<?php endif; ?>
			<i class="vn" id="v<?= e($row['id']) ?>" data-label="<?= e($page_anchor_data_label.' a'.$row['verse_no']) ?>">(<?= e($row['verse_no']) ?>)</i><i<?= $row['sajdah'] ? ' class="sajdah"' : '' ?>><?= e($row['verse']) ?></i>
		<?php	endforeach; ?>
			</section>
		</div>
		<div class="overlay" id="program-info-popup">
			<div class="popup">
				<button type="button" id="program-info-popup-close-btn" class="close-btn right rb-circle-xmark" aria-label="Close program info"></button>
				<h3><i class="logo rb-easyquran-solid"></i> <?= e($prg_name.' '.$version_tag) ?></h3>
				<div id="program-info-content"></div>
			</div>
		</div>
		<div class="overlay" id="bookmark-list-popup">
			<div class="popup">
				<button type="button" id="bookmark-list-popup-close-btn" class="close-btn right rb-circle-xmark" aria-label="Close bookmarks"></button>
				<h3><i class="logo rb-easyquran-solid"></i> <?= e($prg_name.' '.$version_tag) ?></h3>
				<h4 id="bookmark-list-header">Bookmark List</h4>
				<ul id="bookmark-list-content"></ul>
			</div>
		</div>
	</div>
	<footer>
		<a target="_blank" rel="noopener" href="<?= e($repository) ?>">
			<i class="logo rb-easyquran-solid" title="<?= e($prg_name) ?>"></i>
			 <?= e($prg_name . ' ' . $version_tag) ?>
		</a>
	</footer>
</body>
</html>
