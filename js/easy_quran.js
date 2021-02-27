window.onload = ()=>{

	// Define elements
	let bgColorList         = document.getElementById('bg_color_list');
	let bookmarkContainer   = document.getElementById('bookmark_container');
	let bookmarkIcon        = document.getElementById('bookmark_icon');
	let bottomBtn           = document.getElementById('bottom_btn');
	let closeNavLeftBtn     = document.getElementById('close_nav_left');
	let closeNavRightBtn    = document.getElementById('close_nav_right');
	let closePopupBtn       = document.getElementById('close_popup_btn');
	let colorList           = document.getElementById('color_list');
	let fontFamilyList      = document.getElementById('font_family_list');
	let fontSizeList        = document.getElementById('font_size_list');
	let gotoPageBtn         = document.getElementById('goto_page_btn');
	let juzList             = document.getElementById('juz_list');
	let languageList        = document.getElementById('language_list');
	let loadingOverlay      = document.getElementById('loading_overlay');
	let navLeft             = document.getElementById('nav_left');
	let navLoading          = document.getElementById('nav_loading');
	let navRight            = document.getElementById('nav_right');
	let navTop              = document.getElementById('nav_top');
	let openNavLeftBtn      = document.getElementById('open_nav_left');
	let openNavRightBtn     = document.getElementById('open_nav_right');
	let pageNo              = document.getElementById('page_no');
	let programInfoBtn      = document.getElementById('program_info_btn');
	let programInfoContent  = document.getElementById('program_info_content');
	let programInfoPopup    = document.getElementById('program_info_popup');
	let quranVerses         = document.getElementById('quran_verses');
	let resetBtn            = document.getElementById('reset_btn');
	let settingsHeader      = document.getElementById('settings_header');
	let settingsMessage     = document.getElementById('settings_message');
	let suraList            = document.getElementById('sura_list');
	let suraIdOrderBtn      = document.getElementById('sura_id_order');
	let suraAzOrderBtn      = document.getElementById('sura_az_order');
	let suraShortcutList    = document.getElementById('sura_shortcuts');
	let topBtn              = document.getElementById('top_btn');

	// Anchors and infos in quran
	// let verseAnchors        = document.querySelectorAll('.vn');
	let juzAnchors          = document.querySelectorAll('.ca');
	let pageAnchors         = document.querySelectorAll('.pa');
	let pageInfoBtns        = document.querySelectorAll('.ib');
	let pageInfos           = document.querySelectorAll('.pi');
	// let suraShortcuts       = document.querySelectorAll('#sura_shortcuts li');

	// Labels
	let bgColorListLabel    = document.getElementById('bg_color_list_label');
	let colorListLabel      = document.getElementById('color_list_label');
	let fontFamilyListLabel = document.getElementById('font_family_list_label');
	let fontSizeListLabel   = document.getElementById('font_size_list_label');
	let juzListLabel        = document.getElementById('juz_list_label');
	let languageListLabel   = document.getElementById('language_list_label');
	let pageInputLabel      = document.getElementById('page_input_label');
	let suraListLabel       = document.getElementById('sura_list_label');
	let suraShortcutsLabel  = document.getElementById('sura_shortcuts_label');


	loading(false);

	// Set current language first
	if( typeof currentLanguage === 'undefined')
	{
		let lang   = navigator.language.split(/[_-]/)[0];

		if (languages.hasOwnProperty(lang))
		{
			defaultLanguage = lang;
		}
		else
		{
			defaultLanguage = 'en';
		}

		if (defaultLanguage != 'tr')
		{
			var currentLanguage = 'tr';
			replaceBookmarksAndInfos(defaultLanguage);
		}

		var currentLanguage = defaultLanguage;
	}

	setLabels(currentLanguage);
	fillSelects();
	fillSuras(currentLanguage);
	fillShortcuts(currentLanguage);

	// Than install event listeners for quick responsiveness then settings if exist
	installEventListeners();
	restoreSettings();

	async function installEventListeners()
	{
		// Language list
		languageList.addEventListener('change', (e)=>{
			setLanguage(languageList.value);
		});

		// Page infos
		let piLength = pageInfoBtns.length
		for(let i = 0; i < piLength; i++)
		{
			pageInfoBtns[i].addEventListener('click', ()=>{pageInfoBtns[i].classList.toggle('open')});
		}

		// Juz anchors
		let jaLength = juzAnchors.length
		for(let i=0; i < jaLength; i++)
		{
			juzAnchors[i].addEventListener('click', addBookmark, false);
		}

		// Page anchors
		let paLength = pageAnchors.length
		for(let i=0; i < paLength; i++)
		{
			pageAnchors[i].addEventListener('click', addBookmark, false);
		}

		// // Verse anchors
		// let vaLength = verseAnchors.length
		// for(let i=0; i < vaLength; i++)
		// {
		// 	verseAnchors[i].addEventListener('click', addBookmark, false);
		// }

		// Font family List
		fontFamilyList.addEventListener('change', ()=>{
			setFontFamily(fontFamilyList.value);
		});

		// Font size list
		fontSizeList.addEventListener('change', (e)=>{
			setFontSize(fontSizeList.value);
		});

		// Color list
		colorList.addEventListener('change', (e)=>{
			setColor(colorList.value);
		});

		// Background color list
		bgColorList.addEventListener('change', (e)=>{
			setBgColor(bgColorList.value);
		});

		// Reset settings button
		resetBtn.addEventListener('click', (e)=>{
			resetSettings();
		});

		// Sura list
		suraList.addEventListener('change', suraToTop);

		// Sura order
		suraIdOrderBtn.addEventListener('click', ()=>{fillSuras(currentLanguage, 'id')});
		suraAzOrderBtn.addEventListener('click', ()=>{fillSuras(currentLanguage, 'az')});

		// Juz list
		juzList.addEventListener('change', juzToTop);

		// Page no input
		pageNo.addEventListener('keyup', function(e){if (e.keyCode == 13) pageToTop()});
		gotoPageBtn.addEventListener('click', pageToTop);

		// Quran to top
		topBtn.addEventListener('click', quranToTop);

		// Quran to bottom
		bottomBtn.addEventListener('click', quranToBottom);

		// Clean bookmark
		bookmarkIcon.addEventListener('click', removeBookmark);

		// Program info
		programInfoPopup.addEventListener('click', closeInfoPopup);
		programInfoBtn.addEventListener('click', openInfoPopup);
		closePopupBtn.addEventListener('click', closeInfoPopup);

		// Nav left
		openNavLeftBtn.addEventListener('click', openNavLeft);
		closeNavLeftBtn.addEventListener('click', closeNavLeft);
		quranVerses.addEventListener('swipeRight', openNavLeft);
		navLeft.addEventListener('swipeLeft', closeNavLeft);

		// Nav right
		openNavRightBtn.addEventListener('click', openNavRight);
		closeNavRightBtn.addEventListener('click', closeNavRight);
		quranVerses.addEventListener('swipeLeft', openNavRight);
		navRight.addEventListener('swipeRight', closeNavRight);

		quranVerses.addEventListener('click', closeNavs);
	}

	function restoreSettings()
	{
		// Restore bookmark
		if (localStorage.getItem('bookmarkTarget'))
		{
			bookmarkTarget = localStorage.getItem('bookmarkTarget');
			bookmarkLabel  = localStorage.getItem('bookmarkLabel');
			setBookmark(bookmarkTarget, bookmarkLabel);
			gotoBookmark(bookmarkTarget);
		}

		// Restore language
		if (localStorage.getItem('language'))
		{
			language = localStorage.getItem('language');
			languageList.value = language;
			setLanguage(language);
		}

		// Restore font family
		if (localStorage.getItem('fontFamily'))
		{
			fontFamily = localStorage.getItem('fontFamily');
			fontFamilyList.value = fontFamily;
			setFontFamily(fontFamily);
		}

		// Restore font size
		if (localStorage.getItem('fontSize'))
		{
			fontSize = localStorage.getItem('fontSize');
			fontSizeList.value = fontSize;
			setFontSize(fontSize);
		}

		// Restore color
		if (localStorage.getItem('color'))
		{
			color = localStorage.getItem('color');
			colorList.value = color;
			setColor(color);
		}

		// Restore background color
		if (localStorage.getItem('bgColor'))
		{
			bgColor = localStorage.getItem('bgColor');
			bgColorList.value = bgColor;
			setBgColor(bgColor);
		}

		// Restore sura order
		if (localStorage.getItem('sura_order'))
		{
			sura_order = localStorage.getItem('sura_order')
			fillSuras(currentLanguage, sura_order)
		}
	}

	function setLanguage(language)
	{
		setLabels(language);
		replaceBookmarksAndInfos(language);
		fillSuras(language);
		fillShortcuts(language);

		currentLanguage = language;
		localStorage.setItem('language', language);
		closeNavs();
	}

	function replaceBookmarksAndInfos(language)
	{
		for (var i = 0; i < juzAnchors.length; i++) {
			juzAnchors[i].textContent = juzAnchors[i].textContent.replace(translations[currentLanguage]['juz_anchor_label'], translations[language]['juz_anchor_label']);
		}

		for (var i = 0; i < pageAnchors.length; i++) {
			pageAnchors[i].textContent = pageAnchors[i].textContent.replace(translations[currentLanguage]['page_anchor_label'], translations[language]['page_anchor_label']);
		}

		for (var i = 0; i < pageInfos.length; i++) {
			pageInfos[i].textContent = pageInfos[i].textContent.replace(translations[currentLanguage]['page_info_page'], translations[language]['page_info_page']);
			pageInfos[i].textContent = pageInfos[i].textContent.replace(translations[currentLanguage]['page_info_juz'], translations[language]['page_info_juz']);
		}

		let bookmark = document.getElementById('bookmark');
		if (bookmark)
		{
			bookmark.textContent = bookmark.textContent.replace(translations[currentLanguage]['juz_anchor_label'], translations[language]['juz_anchor_label']);
			bookmark.textContent = bookmark.textContent.replace(translations[currentLanguage]['page_anchor_label'], translations[language]['page_anchor_label']);
		}
	}

	function setLabels(language)
	{
		suraListLabel.textContent       = translations[language][suraListLabel.id];
		suraShortcutsLabel.textContent  = translations[language][suraShortcutsLabel.id];
		juzListLabel.textContent        = translations[language][juzListLabel.id];
		pageInputLabel.textContent      = translations[language][pageInputLabel.id];
		fontFamilyListLabel.textContent = translations[language][fontFamilyListLabel.id];
		fontSizeListLabel.textContent   = translations[language][fontSizeListLabel.id];
		colorListLabel.textContent      = translations[language][colorListLabel.id];
		bgColorListLabel.textContent    = translations[language][bgColorListLabel.id];
		languageListLabel.textContent   = translations[language][languageListLabel.id];
		gotoPageBtn.textContent         = translations[language][gotoPageBtn.id];
		resetBtn.textContent            = translations[language][resetBtn.id];
		settingsHeader.textContent      = translations[language][settingsHeader.id];
		settingsMessage.textContent     = translations[language][settingsMessage.id];
	}

	function fillSelects()
	{
		createOptions(fontFamilyList, fontFamilies, defaultFontFamily);
		createOptions(fontSizeList, fontSizes, defaultFontSize);
		createOptions(colorList, colors, defaultColor);
		createOptions(bgColorList, bgColors, defaultBgColor);
		createOptions(languageList, languages, defaultLanguage);
		createOptions(juzList, ajza, null);
	}

	function createOptions(selectElement, options, defaultOption)
	{
		for ([value, text] of Object.entries(options))
		{
			option = document.createElement('option');
			option.value = value;
			option.textContent = text;
			selectElement.appendChild(option);
			if (defaultOption == value) selectElement.value = value;
		}
	}

	function fillSuras(language, order = 'id')
	{
		// First remove list items before adding new ones
		while(child = suraList.lastChild){suraList.removeChild(child)}

		let suras = order == 'id' ? translations[language]['suras_id_order'] : translations[language]['suras_az_order']
		createOptions(suraList, suras, null)

		localStorage.setItem('sura_order', order)
	}

	function fillShortcuts(language)
	{
		let listElement = suraShortcutList
		let listItems   = translations[language]['sura_shortcuts']

		// First remove list items before adding new ones
		while(child = listElement.lastChild){listElement.removeChild(child)}

		for ([value, text] of Object.entries(listItems))
		{
			let listItem = document.createElement('li');
			listItem.dataset.suraId = value;
			listItem.textContent = text;
			listItem.addEventListener('click', ()=>{suraShortcutToTop(listItem)})
			listElement.appendChild(listItem);
		}
	}

	function addBookmark()
	{
		bookmarkTarget = this.id;
		firstLetter    = bookmarkTarget.substr(0,1)
		switch (firstLetter)
		{
			case 'p':
				bookmarkType = 'page'
				break
			case 'j':
				bookmarkType = 'juz'
				break
			// case 'v':
			// 	bookmarkType = 'verse'
			// 	break
			default:
				bookmarkType = 'page'
		}
		bookmarkLabel  = bookmarkTarget.startsWith('v') ? this.dataset.label : this.textContent;
		setBookmark(bookmarkTarget, bookmarkLabel, bookmarkType);
		localStorage.setItem('bookmarkTarget', bookmarkTarget);
		localStorage.setItem('bookmarkLabel', bookmarkLabel);
		localStorage.setItem('bookmarkType', bookmarkType);
	}

	function setBookmark(bookmarkTarget, bookmarkLabel, bookmarkType)
	{
		bookmark = document.getElementById('bookmark');
		if(bookmark) bookmark.remove();

		newBookmark                = document.createElement('span');
		newBookmark.id             = 'bookmark';
		newBookmark.dataset.target = bookmarkTarget;
		newBookmark.dataset.type   = bookmarkType;
		newBookmarkLabel           = document.createTextNode(bookmarkLabel);
		newBookmark.appendChild(newBookmarkLabel);
		newBookmark.addEventListener('click', ()=>{gotoBookmark(bookmarkTarget, bookmarkType)});
		bookmarkContainer.appendChild(newBookmark);
	}

	function gotoBookmark(bookmarkTarget, bookmarkType = "page")
	{
		closeNavs();
		document.getElementById(bookmarkTarget).scrollIntoView();

		// if (bookmarkType == 'verse')
		// {
		// 	window.scrollBy(0, -navTop.offsetHeight - parseInt(defaultFontSize));
		// }
		// else
		// {
			window.scrollBy(0, -navTop.offsetHeight);
		// }
	}

	function removeBookmark()
	{
		let bookmark = document.getElementById('bookmark');

		if (bookmark)
		{
			let answer = confirm(translations[currentLanguage]['confirm_delete_bookmark']);
			if (answer)
			{
				bookmark.remove();
				localStorage.removeItem('bookmarkTarget');
				localStorage.removeItem('bookmarkLabel');
				localStorage.removeItem('bookmarkType');
			}
		}
	}

	function settingLoading(showLoading)
	{
		if(showLoading)
		{
			navLoading.classList.add('open')
		}
		else
		{
			navLoading.classList.remove('open')
		}
	}

	function resetSettings()
	{
		let answer = confirm(translations[currentLanguage]['confirm_reset']);
		if (answer)
		{
			// Reset selection list values
			fontFamilyList.value = defaultFontFamily;
			fontSizeList.value   = defaultFontSize;
			colorList.value      = defaultColor;
			bgColorList.value    = defaultBgColor;
			languageList.value   = defaultLanguage;

			// Propagate reset settings
			fontFamilyList.dispatchEvent(new Event('change', {'bubbles': true}));
			fontSizeList.dispatchEvent(new Event('change', {'bubbles': true}));
			colorList.dispatchEvent(new Event('change', {'bubbles': true}));
			bgColorList.dispatchEvent(new Event('change', {'bubbles': true}));
			languageList.dispatchEvent(new Event('change', {'bubbles': true}));
		}
	}

	function closeNavs()
	{
		navLeft.classList.remove('open');
		navRight.classList.remove('open');
		programInfoPopup.classList.remove('open');
	}

	function closeNavLeft()
	{
		navLeft.classList.remove('open');
	}

	function closeNavRight()
	{
		navRight.classList.remove('open');
	}

	function openNavLeft()
	{
		navLeft.classList.toggle('open');
		navRight.classList.remove('open');
		programInfoPopup.classList.remove('open');
	}

	function openNavRight()
	{
		navLeft.classList.remove('open');
		navRight.classList.toggle('open');
		programInfoPopup.classList.remove('open');
	}

	async function openInfoPopup()
	{
		navLeft.classList.remove('open');
		navRight.classList.remove('open');
		programInfoContent.innerHTML = await fetchLangHTML(currentLanguage, 'program_info')
		programInfoPopup.classList.toggle('open');
	}

	async function fetchLangHTML(language, file)
	{
		result = ''
		path = 'languages/'+language+'/'+file+'.html?'+Date.now()
		await fetch(path).then(data=>data.text()).then(html=>{
			result = html
		})
		return result
	}

	function closeInfoPopup()
	{
		programInfoPopup.classList.remove('open');
	}

	function quranToTop()
	{
		closeNavs();
		document.getElementById('quran_container').scrollIntoView();
	}

	function quranToBottom()
	{
		closeNavs();
		document.getElementById('quran_container').scrollIntoView({block:'end'});
	}

	function suraToTop()
	{
		juzList.selectedIndex = 0;
		pageNo.value = null;
		closeNavs();

		if (this.value)
		{
			document.getElementById(suraList.value).scrollIntoView();
			window.scrollBy(0, -navTop.offsetHeight);
		}
	}

	function juzToTop()
	{
		suraList.selectedIndex = 0;
		pageNo.value = null;
		closeNavs();

		if (this.value)
		{
			document.getElementById(this.value).scrollIntoView();
			window.scrollBy(0, -navTop.offsetHeight);
		}
	}

	function pageToTop()
	{
		suraList.selectedIndex = 0;
		juzList.selectedIndex = 0;
		closeNavs();

		if (parseInt(pageNo.value) >= 0 && parseInt(pageNo.value) <= 604)
		{
			document.getElementById('p'+pageNo.value).scrollIntoView();
			window.scrollBy(0, -navTop.offsetHeight);
		}
	}

	function suraShortcutToTop(shortcut)
	{
		if (shortcut.dataset.suraId)
		{
			document.getElementById(shortcut.dataset.suraId).scrollIntoView();
			window.scrollBy(0, -navTop.offsetHeight);
		}

		closeNavs();
	}

	function setColor(color)
	{
		document.documentElement.style.setProperty('--set-color', color);

		if (color != defaultColor)
		{
			localStorage.setItem('color', color);
		}
		else
		{
			localStorage.removeItem('color')
		}

		closeNavs();
	}

	function setBgColor(bgColor)
	{
		document.documentElement.style.setProperty('--set-bg-color', bgColor);

		if (bgColor != defaultBgColor)
		{
			localStorage.setItem('bgColor', bgColor);
		}
		else
		{
			localStorage.removeItem('bgColor')
		}

		closeNavs();
	}

	function setFontSize(fontSize)
	{
		document.documentElement.style.setProperty('--set-font-size', fontSize)

		if (fontSize != defaultFontSize)
		{
			localStorage.setItem('fontSize', fontSize);
		}
		else
		{
			localStorage.removeItem('fontSize')
		}

		closeNavs();
	}

	function setFontFamily(fontFamily)
	{
		document.documentElement.style.setProperty('--set-font-family', fontFamily);

		if (fontFamily != defaultFontFamily)
		{
			localStorage.setItem('fontFamily', fontFamily);
		}
		else
		{
			localStorage.removeItem('fontFamily')
		}

		closeNavs();
	}

	function loading(load = true, opacity = 1)
	{
		if(load)
		{
			loadingOverlay.style.display = 'block';
			loadingOverlay.style.opacity = opacity;
			loadingOverlay.style.visibility = 'visible';
		}
		else
		{
			loadingOverlay.style.opacity = '0';
			loadingOverlay.style.visibility = 'hidden';
			loadingOverlay.style.display = 'none';
		}

	}
};
