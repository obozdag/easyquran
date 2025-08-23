<?php
	$prg_name    = 'Easy Quran';
	$version     = 'v1.93.17';
	$color       = '#008b8b';
	$pdo         = new PDO('sqlite:db/quran.db');
	$rows_sura   = $pdo->query('SELECT * FROM fkl_sura');
	$rows_verse  = $pdo->query('SELECT v.*, s.name AS sura_name, s.tr AS sura_tr, s.en AS sura_en, s.basmala, s.verses, s.sajdah AS sura_sajdah FROM fkl_verse v INNER JOIN fkl_sura s ON s.id = v.sura_id');
?>
<!DOCTYPE html>
<html lang="ar">
<head>
	<title>Easy Quran</title>
	<meta charset="utf-8">
	<meta name="description" content="Easy Quran, easy to read, easy to scroll (top-to-bottom), lightweight (2.7MB), lightning fast, multi language, responsive, progressive web app.">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="apple-mobile-web-app-status-bar" content="<?= $color ?>">
	<meta name="theme-color" content="<?= $color ?>">
	<link rel="canonical" href="https://quran.fklavye.net">
	<link rel="preload" href="/css/fonts/EasyArabic.ttf" as="font" crossorigin>
	<link rel="preload" href="/css/fonts/rb.ttf" as="font" crossorigin>
	<link rel="stylesheet" type="text/css" href="/css/easy_quran.css">
	<link rel="apple-touch-icon" href="/css/icons/easy_quran_96x96.png">
	<link rel="manifest" href="/easy_quran.json">
	<script type="text/javascript">
		var prg_name = '<?= $prg_name ?>';
		var version  = '<?= $version ?>';
	</script>
	<script src="/js/swipe.js"></script>
	<script src="/js/lang.js"></script>
	<script src="/js/settings.js"></script>
	<script src="/js/easy_quran.js"></script>
	<script src="/app.js"></script>
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
		<i id="open-nav-left" class="nav-top-btn rb-book-quran" title="Nav Left"></i>
		<i id="program-info-btn" class="nav-top-btn rb-easyquran-solid" title="Program Info"></i>
		<i id="top-btn" class="nav-top-btn rb-up" title="Top"></i>
		<i id="bottom-btn" class="nav-top-btn rb-down" title="Bottom"></i>
		<span><i id="bookmark-list-btn" class="nav-top-btn rb-bookmark" title="Bookmark"></i><span id="bookmark-container"></span></span>
		<i id="open-nav-right" class="nav-top-btn rb-slider" title="Nav Right"></i>
	</nav>
	<nav id="nav-left" class="nav-side">
		<i class="close-btn right rb-circle-xmark" id="close-nav-left"></i>
		<div class="settings">
			<h3><i class="logo rb-easyquran-solid"></i> <?= $prg_name ?></h3>
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
		<i class="close-btn left rb-circle-xmark" id="close-nav-right"></i>
		<h3><i class="logo rb-easyquran-solid"></i> <?= $prg_name ?></h3>
		<h4 id="settings-header"></h4>
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
				<i class="ca" id="<?= $juz_anchor_href ?>"><?= $juz_anchor_label ?></i>
			<?php endif; ?>
				<i class="pa" id="<?= $page_anchor_href ?>" ><?= $page_anchor_label ?></i>
				<i class="ib rb-circle-info"></i>
				<i class="pi"><?= $page_info ?></i>
			</p>
			<?php endif; ?>
			<?php if ($row['new_sura']): ?>
			<?php $sura_href   = 's'.$row['sura_id']; ?>
			<?php $sura_header = $row['sura_id'].' '.$row['sura_tr'].$sura_info.' سُورَةُ '.$row['sura_name']; ?>
			<h4 class="sn" id="<?= $sura_href ?>"><?= $sura_header ?></h4>
				<?php if ($row['basmala']): ?>
				<p class="basmala">بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحٖيمِ</p>
				<?php endif; ?>
			<?php endif; ?>
			<i class="vn" id="v<?= $row['id'] ?>" data-label="<?= $page_anchor_data_label.' a'.$row['verse_no'] ?>">(<?= $row['verse_no'] ?>)</i><i<?= $row['sajdah'] ? ' class="sajdah"' : '' ?>><?= $row['verse'] ?></i>
		<?php	endforeach; ?>
			</section>
		</div>
		<div class="overlay" id="program-info-popup">
			<div class="popup">
				<i id="program-info-popup-close-btn" class="close-btn right rb-circle-xmark"></i>
				<h3><i class="logo rb-easyquran-solid"></i> <?= $prg_name.' '.$version ?></h3>
				<div id="program-info-content"></div>
			</div>
		</div>
		<div class="overlay" id="bookmark-list-popup">
			<div class="popup">
				<i id="bookmark-list-popup-close-btn" class="close-btn right rb-circle-xmark"></i>
				<h3><i class="logo rb-easyquran-solid"></i> <?= $prg_name ?></h3>
				<h4 id="bookmark-list-header">Bookmark List</h4>
				<div id="bookmark-list-content"></div>
			</div>
		</div>
	</div>
	<footer>
		<a target="_blank" href="https://github.com/obozdag/easyquran">
			<i class="logo rb-easyquran-solid" title="<?= $prg_name ?>"></i>
			 <?= $prg_name ?>
	</footer>
</body>
</html>
