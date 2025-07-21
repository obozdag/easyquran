<?php
	$version     = 'v1.93.16';
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
		var version = '<?= $version ?>'
	</script>
</head>
<body>
	<div id="loading_overlay">
		<div id="loading_content">
			<h3>Easy Quran</h3>
			<p><img src="/css/icons/loading.gif"></p>
			<p>Loading...</p>
			<p>quran.fklavye.net</p>
		</div>
	</div>
	<nav id="nav_top">
		<i id="open_nav_left" class="nav_top_btn rb-book-quran" title="Nav Left"></i>
		<i id="program_info_btn" class="nav_top_btn rb-easyquran-solid" title="Program Info"></i>
		<i id="top_btn" class="nav_top_btn rb-up" title="Top"></i>
		<i id="bottom_btn" class="nav_top_btn rb-down" title="Bottom"></i>
		<span><i id="bookmark_list_btn" class="nav_top_btn rb-bookmark" title="Bookmark"></i><span id="bookmark_container"></span></span>
		<i id="open_nav_right" class="nav_top_btn rb-slider" title="Nav Right"></i>
	</nav>
	<nav id="nav_left" class="nav-side">
		<i class="close_btn right rb-circle-xmark" id="close_nav_left"></i>
		<div class="settings">
			<div class="row">
				<label id="sura_list_label"></label>
				<div class="flex">
					<select id="sura_list" class="mr-1">
						<?php
						// foreach ($rows_sura as $row):
						// 	$id     = $row['id'];
						// 	$sajdah = $row['sajdah'] ? '*': '';
						// 	$option = $row['en'].' '.$id.' ('.$row['verses'].')'.$sajdah;
						// 	echo "<option value=\"s{$id}\">{$option}</option>\n";
						// endforeach;
						?>
					</select>
					<button type="button" class="btn btn_nav mr-1" id="sura_az_order" title="Order by Sura Name"><i class="rb-arrow-down-a-z"></i></button>
					<button type="button" class="btn btn_nav" id="sura_id_order"><i class="rb-arrow-down-123" title="Order by Sura Number"></i></button>
				</div>
			</div>
			<div class="row">
				<label id="juz_list_label"></label>
				<select id="juz_list">
					<option></option>
				</select>
			</div>
			<div class="row">
				<label id="page_input_label"></label>
				<span class="goto_page_container">
					<input type="text" id="page_no" size="3" min="0" max="604" maxlength="3" pattern="\d{1,3}" title="Sayfa numarası 0-604">
					<button type="button" class="btn btn_nav" id="goto_page_btn"></button>
				</span>
			</div>
			<div class="row" id="sura_shortcuts_row">
				<label id="sura_shortcuts_label"></label>
				<div id="sura_shortcuts_container">
					<ul id="sura_shortcuts">
					</ul>
				</div>
			</div>
		</div>
	</nav>
	<nav id="nav_right" class="nav-side">
		<i class="close_btn left rb-circle-xmark" id="close_nav_right"></i>
		<h4 id="settings_header"></h4>
		<div class="settings">
			<div class="row">
				<label id="font_family_list_label"></label>
				<select id="font_family_list"></select>
			</div>
			<div class="row">
				<label id="font_size_list_label"></label>
				<select id="font_size_list"></select>
			</div>
			<div class="row">
				<label id="color_list_label"></label>
				<select id="color_list"></select>
			</div>
			<div class="row">
				<label id="bg_color_list_label"></label>
				<select id="bg_color_list"></select>
			</div>
			<div class="row">
				<label id="language_list_label"></label>
				<select id="language_list"></select>
			</div>
			<div class="row">
				<label></label>
				<button type="button" class="btn btn_nav" id="reset_btn"></button>
			</div>
			<div id="nav_loading" class="nav-loading">
				<p id="settings_message"></p>
			</div>
		</div>
	</nav>
	<div class="container" id="quran_container">
		<div id="quran_verses" class="arabic">
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
		<div class="overlay" id="program_info_popup">
			<div class="popup">
				<i id="program_info_popup_close_btn" class="close_btn right rb-circle-xmark"></i>
				<h3><i class="logo rb-easyquran-solid"></i> Easy Quran <?= $version ?></h3>
				<div id="program_info_content"></div>
			</div>
		</div>
		<div class="overlay" id="bookmark_list_popup">
			<div class="popup">
				<i id="bookmark_list_popup_close_btn" class="close_btn right rb-circle-xmark"></i>
				<h3><i class="logo rb-easyquran-solid"></i> Easy Quran <?= $version ?></h3>
				<h4>Bookmark List</h4>
				<div id="bookmark_list_content"></div>
			</div>
		</div>
	</div>
	<footer>
		<a target="_blank" href="https://github.com/obozdag/easyquran"><i class="logo rb-easyquran-solid" title="Easy Quran"></i> Easy Quran <?= $version ?></a>
	</footer>
	<script src="/js/swipe.js"></script>
	<script src="/js/lang.js"></script>
	<script src="/js/settings.js"></script>
	<script src="/js/easy_quran.js"></script>
	<script src="/app.js"></script>
	<!--index.php-->
</body>
</html>
