window.onload = ()=>{

	// Define elements
	let bgColorList         = document.getElementById('bg-color-list');
	let bookmarkListHeader  = document.getElementById('bookmark-list-header');
	let bookmarkContainer   = document.getElementById('bookmark-container');
	let bookmarkListBtn     = document.getElementById('bookmark-list-btn');
	let bookmarkListContent = document.getElementById('bookmark-list-content');
	let bookmarkListPopup   = document.getElementById('bookmark-list-popup');
	let bookmarkListPopupCloseBtn = document.getElementById('bookmark-list-popup-close-btn');
	let bottomBtn           = document.getElementById('bottom-btn');
	let closeNavLeftBtn     = document.getElementById('close-nav-left');
	let closeNavRightBtn    = document.getElementById('close-nav-right');
	let colorList           = document.getElementById('color-list');
	let fontFamilyList      = document.getElementById('font-family-list');
	let fontSizeList        = document.getElementById('font-size-list');
	let gotoPageBtn         = document.getElementById('goto-page-btn');
	let juzList             = document.getElementById('juz-list');
	let languageList        = document.getElementById('language-list');
	let loadingOverlay      = document.getElementById('loading-overlay');
	let navLeft             = document.getElementById('nav-left');
	let navLoading          = document.getElementById('nav-loading');
	let navRight            = document.getElementById('nav-right');
	let navTop              = document.getElementById('nav-top');
	let openNavLeftBtn      = document.getElementById('open-nav-left');
	let openNavRightBtn     = document.getElementById('open-nav-right');
	let pageNo              = document.getElementById('page-no');
	let programInfoBtn      = document.getElementById('program-info-btn');
	let programInfoContent  = document.getElementById('program-info-content');
	let programInfoPopup    = document.getElementById('program-info-popup');
	let programInfoPopupCloseBtn  = document.getElementById('program-info-popup-close-btn');
	let quranVerses         = document.getElementById('quran-verses');
	let resetBtn            = document.getElementById('reset-btn');
	let settingsHeader      = document.getElementById('settings-header');
	let settingsMessage     = document.getElementById('settings-message');
	let suraAzOrderBtn      = document.getElementById('sura-az-order');
	let suraIdOrderBtn      = document.getElementById('sura-id-order');
	let suraList            = document.getElementById('sura-list');
	let suraShortcutList    = document.getElementById('sura-shortcuts');
	let topBtn              = document.getElementById('top-btn');

	// Anchors and infos in quran
	// let verseAnchors        = document.querySelectorAll('.vn');
	let juzAnchors          = document.querySelectorAll('.ca');
	let pageAnchors         = document.querySelectorAll('.pa');
	let pageInfoBtns        = document.querySelectorAll('.ib');
	let pageInfos           = document.querySelectorAll('.pi');
	// let suraShortcuts       = document.querySelectorAll('#sura-shortcuts li');

	// Labels
	let bgColorListLabel    = document.getElementById('bg-color-list-label');
	let colorListLabel      = document.getElementById('color-list-label');
	let fontFamilyListLabel = document.getElementById('font-family-list-label');
	let fontSizeListLabel   = document.getElementById('font-size-list-label');
	let juzListLabel        = document.getElementById('juz-list-label');
	let languageListLabel   = document.getElementById('language-list-label');
	let pageInputLabel      = document.getElementById('page-input-label');
	let suraListLabel       = document.getElementById('sura-list-label');
	let suraShortcutsLabel  = document.getElementById('sura-shortcuts-label');

	const navs              = [navLeft, navRight, programInfoPopup, bookmarkListPopup];
	let bookmarks           = bookmarksRead();

	
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
			juzAnchors[i].addEventListener('click', bookmarkAdd, false);
		}

		// Page anchors
		let paLength = pageAnchors.length
		for(let i=0; i < paLength; i++)
		{
			pageAnchors[i].addEventListener('click', bookmarkAdd, false);
		}

		// // Verse anchors
		// let vaLength = verseAnchors.length
		// for(let i=0; i < vaLength; i++)
		// {
		// 	verseAnchors[i].addEventListener('click', bookmarkAdd, false);
		// }

		// Font family List
		fontFamilyList.addEventListener('change', ()=>{setFontFamily(fontFamilyList.value);});

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

		// Program info
		programInfoPopup.addEventListener('click', closeProgramInfoPopup);
		programInfoBtn.addEventListener('click', function(e){openProgramInfoPopup(programInfoPopup)});
		programInfoPopupCloseBtn.addEventListener('click', closeProgramInfoPopup);

		// Bookmark list
		bookmarkListPopup.addEventListener('click', bookmarkListPopupClose);
		bookmarkListBtn.addEventListener('click', bookmarkListPopupOpen);
		bookmarkListPopupCloseBtn.addEventListener('click', bookmarkListPopupClose);

		// Clean bookmark
		// bookmarkIcon.addEventListener('click', removeBookmark);

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
		// Restore bookmarks
		if (localStorage.getItem('bookmarks'))
		{
			fillBookmarkList();
			if(bookmarks[0]?.target) gotoBookmark(bookmarks[0].target);
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
		bgColorListLabel.textContent    = translations[language][bgColorListLabel.id];
		colorListLabel.textContent      = translations[language][colorListLabel.id];
		fontFamilyListLabel.textContent = translations[language][fontFamilyListLabel.id];
		fontSizeListLabel.textContent   = translations[language][fontSizeListLabel.id];

		bookmarkListHeader.textContent  = translations[language][bookmarkListHeader.id];
		gotoPageBtn.textContent         = translations[language][gotoPageBtn.id];
		juzListLabel.textContent        = translations[language][juzListLabel.id];
		languageListLabel.textContent   = translations[language][languageListLabel.id];
		pageInputLabel.textContent      = translations[language][pageInputLabel.id];
		resetBtn.textContent            = translations[language][resetBtn.id];
		settingsHeader.textContent      = translations[language][settingsHeader.id];
		settingsMessage.textContent     = translations[language][settingsMessage.id];
		suraListLabel.textContent       = translations[language][suraListLabel.id];
		suraShortcutsLabel.textContent  = translations[language][suraShortcutsLabel.id];
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
		let listItems   = translations[language]['sura-shortcuts']

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

	function bookmarksRead()
	{
		const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || []
		return bookmarks
	}

	function bookmarksStore(bookmarks)
	{
		localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
	}

	async function fillBookmarkList()
	{
		let bookmarkElement
		let bookmarkListItem

		bookmarkContainer.innerHTML = null
		bookmarkListContent.innerHTML = null
		const bookmarks = bookmarksRead()
		bookmarks.forEach(function(bookmark){
				bookmarkElement = bookmarkElementCreate(bookmark)
				bookmarkListItem = document.createElement('li')
				bookmarkListItem.appendChild(bookmarkElement)
				bookmarkListContent.appendChild(bookmarkListItem)
			}
		)
		bookmarkContainer.appendChild(bookmarkElement.cloneNode(true));
	}

	function bookmarkAdd()
	{
		let type = 'page';
		const target = this.id;
		const firstLetter = target.substr(0,1)
		switch (firstLetter)
		{
			case 'p':
				type = 'page'
				break
			case 'j':
				type = 'juz'
				break
		}
		const label  = target.startsWith('v') ? this.dataset.label : this.textContent;
		const bookmark = {target: target, label: label, type: type};

		bookmarkPush(bookmark);
		fillBookmarkList();
	}

	function bookmarkPush(bookmark)
	{
		const bookmarks = bookmarksRead()
		if(bookmarks.length > 0 && bookmarks[bookmarks.length - 1].target === bookmark.target)
		   return;

		bookmarks.push(bookmark)

		if(bookmarks.length > bookmarksLength)
			bookmarks.shift()

		bookmarksStore(bookmarks)
	}

	function bookmarkElementCreate(bookmark)
	{
		oldBookmark = document.getElementById('bookmark-' + bookmark.target);
		if(oldBookmark) oldBookmark.remove();

		bookmarkElement                = document.createElement('span');
		// bookmarkElement.id             = 'bookmark-' + bookmark.target;
		bookmarkElement.className      = 'bookmark';
		bookmarkElement.dataset.target = bookmark.target;
		bookmarkElement.dataset.type   = bookmark.type;
		bookmarkElement.textContent    = bookmark.label;

		bookmarkElement.addEventListener('click', () => {gotoBookmark(bookmark.target)});

		return bookmarkElement;
	}

	function gotoBookmark(target)
	{
		closeNavs();
		document.getElementById(target).scrollIntoView();

		// if (bookmarkType == 'verse')
		// {
		// 	window.scrollBy(0, -navTop.offsetHeight - parseInt(defaultFontSize));
		// }
		// else
		// {
			window.scrollBy(0, -navTop.offsetHeight);
		// }
	}

	function bookmarksRemove()
	{
		let answer = confirm(translations[currentLanguage]['confirm_delete_bookmark']);
		if (answer)
		{
			localStorage.removeItem('bookmarks')
			fillBookmarkList()
		}
	}

	async function bookmarkListPopupOpen()
	{
		closeNavs();
		bookmarkListPopup.classList.toggle('open');
	}

	function bookmarkListPopupClose()
	{
		closeNavs();
		// bookmarkListPopup.classList.remove('open');
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
			bgColorList.value    = defaultBgColor;
			colorList.value      = defaultColor;
			fontFamilyList.value = defaultFontFamily;
			fontSizeList.value   = defaultFontSize;
			languageList.value   = defaultLanguage;

			// Propagate reset settings
			bgColorList.dispatchEvent(new Event('change', {'bubbles': true}));
			colorList.dispatchEvent(new Event('change', {'bubbles': true}));
			fontFamilyList.dispatchEvent(new Event('change', {'bubbles': true}));
			fontSizeList.dispatchEvent(new Event('change', {'bubbles': true}));
			languageList.dispatchEvent(new Event('change', {'bubbles': true}));
		}
	}

	function toggleWindow(id)
	{

	}
	function closeNavs() {
		navLeft.classList.remove('open');
		navRight.classList.remove('open');
		bookmarkListPopup.classList.remove('open');
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
		closeNavs();
		// bookmarkListPopup.classList.remove('open');
		navLeft.classList.toggle('open');
		// navRight.classList.remove('open');
		// programInfoPopup.classList.remove('open');
	}

	function openNavRight()
	{
		bookmarkListPopup.classList.remove('open');
		navLeft.classList.remove('open');
		navRight.classList.toggle('open');
		programInfoPopup.classList.remove('open');
	}

	async function openProgramInfoPopup(e)
	{
		console.log(e.target)
		closeNavs();
		programInfoContent.innerHTML = await fetchLangHTML(currentLanguage, 'program_info')
		programInfoPopup.classList.toggle('open');
	}

	async function fetchLangHTML(language, file)
	{
		result = ''
		path = 'languages/' + language + '/' + file + '.php?' + Date.now()
		await fetch(path).then(data => data.text()).then(html => {result = html})
		return result
	}

	function closeProgramInfoPopup()
	{
		programInfoPopup.classList.remove('open');
	}

	function quranToTop()
	{
		closeNavs();
		document.getElementById('quran-container').scrollIntoView();
	}

	function quranToBottom()
	{
		closeNavs();
		document.getElementById('quran-container').scrollIntoView({block:'end'});
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
