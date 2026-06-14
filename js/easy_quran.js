window.onload = () => {
  // Define elements
  let bgColorList                  = document.getElementById('bg-color-list');
  let bookmarkListHeader           = document.getElementById('bookmark-list-header');
  let bookmarkContainer            = document.getElementById('bookmark-container');
  let bookmarkListBtn              = document.getElementById('bookmark-list-btn');
  let bookmarkListContent          = document.getElementById('bookmark-list-content');
  let bookmarkListPopup            = document.getElementById('bookmark-list-popup');
  let bookmarkListPopupCloseBtn    = document.getElementById('bookmark-list-popup-close-btn');
  let bottomBtn                    = document.getElementById('bottom-btn');
  let closeNavLeftBtn              = document.getElementById('close-nav-left');
  let closeNavRightBtn             = document.getElementById('close-nav-right');
  let colorList                    = document.getElementById('color-list');
  let fontFamilyList               = document.getElementById('font-family-list');
  let fontSizeList                 = document.getElementById('font-size-list');
  let gotoPageBtn                  = document.getElementById('goto-page-btn');
  let juzList                      = document.getElementById('juz-list');
  let languageList                 = document.getElementById('language-list');
  let loadingOverlay               = document.getElementById('loading-overlay');
  let navLeft                      = document.getElementById('nav-left');
  let navLoading                   = document.getElementById('nav-loading');
  let navRight                     = document.getElementById('nav-right');
  let navTop                       = document.getElementById('nav-top');
  let openNavLeftBtn               = document.getElementById('open-nav-left');
  let openNavRightBtn              = document.getElementById('open-nav-right');
  let pageNo                       = document.getElementById('page-no');
  let programInfoBtn               = document.getElementById('program-info-btn');
  let programInfoContent           = document.getElementById('program-info-content');
  let programInfoPopup             = document.getElementById('program-info-popup');
  let programInfoPopupCloseBtn     = document.getElementById('program-info-popup-close-btn');
  let quranVerses                  = document.getElementById('quran-verses');
  let resetBtn                     = document.getElementById('reset-btn');
  let settingsHeader               = document.getElementById('settings-header');
  let settingsMessage              = document.getElementById('settings-message');
  let suraAzOrderBtn               = document.getElementById('sura-az-order');
  let suraIdOrderBtn               = document.getElementById('sura-id-order');
  let suraList                     = document.getElementById('sura-list');
  let suraShortcutList             = document.getElementById('sura-shortcuts');
  let topBtn                       = document.getElementById('top-btn');

  // Anchors and infos in quran
  let juzAnchors                   = document.querySelectorAll('.ca');
  let pageAnchors                  = document.querySelectorAll('.pa');
  let pageInfoBtns                 = document.querySelectorAll('.ib');
  let pageInfos                    = document.querySelectorAll('.pi');

  // Labels
  let bgColorListLabel             = document.getElementById('bg-color-list-label');
  let colorListLabel               = document.getElementById('color-list-label');
  let fontFamilyListLabel          = document.getElementById('font-family-list-label');
  let fontSizeListLabel            = document.getElementById('font-size-list-label');
  let juzListLabel                 = document.getElementById('juz-list-label');
  let languageListLabel            = document.getElementById('language-list-label');
  let pageInputLabel               = document.getElementById('page-input-label');
  let suraListLabel                = document.getElementById('sura-list-label');
  let suraShortcutsLabel           = document.getElementById('sura-shortcuts-label');

  const navs                       = [navLeft, navRight, programInfoPopup, bookmarkListPopup];
  let bookmarks                    = bookmarksRead();

  loading(false);

  // Set current language first
  if (typeof currentLanguage === 'undefined') {
    let lang = navigator.language.split(/[_-]/)[0];

    if (languages.hasOwnProperty(lang)) {
      defaultLanguage = lang;
    } else {
      defaultLanguage = 'en';
    }

    if (defaultLanguage != 'tr') {
      var currentLanguage = 'tr';
      replaceBookmarksAndInfos(defaultLanguage);
    }

    var currentLanguage = defaultLanguage;
  }

  setLabels(currentLanguage);
  fillSelects();
  fillSuras(currentLanguage);
  fillShortcuts(currentLanguage);

  // Install event listeners for quick responsiveness
  installEventListeners();
  restoreSettings();

  async function installEventListeners() {
    languageList.addEventListener('change', () => { setLanguage(languageList.value); });

    for (let i = 0; i < pageInfoBtns.length; i++) {
      pageInfoBtns[i].addEventListener('click', () => { pageInfoBtns[i].classList.toggle('open'); });
    }

    for (let i = 0; i < juzAnchors.length; i++) {
      juzAnchors[i].addEventListener('click', bookmarkAdd, false);
    }

    for (let i = 0; i < pageAnchors.length; i++) {
      pageAnchors[i].addEventListener('click', bookmarkAdd, false);
    }

    fontFamilyList.addEventListener('change', () => { setFontFamily(fontFamilyList.value); });
    fontSizeList.addEventListener('change', () => { setFontSize(fontSizeList.value); });
    colorList.addEventListener('change', () => { setColor(colorList.value); });
    bgColorList.addEventListener('change', () => { setBgColor(bgColorList.value); });

    resetBtn.addEventListener('click', () => { resetSettings(); });

    suraList.addEventListener('change', suraToTop);
    suraIdOrderBtn.addEventListener('click', () => { fillSuras(currentLanguage, 'id'); });
    suraAzOrderBtn.addEventListener('click', () => { fillSuras(currentLanguage, 'az'); });
    juzList.addEventListener('change', juzToTop);

    pageNo.addEventListener('keyup', (e) => { if (e.keyCode == 13) pageToTop(); });
    gotoPageBtn.addEventListener('click', pageToTop);

    topBtn.addEventListener('click', quranToTop);
    bottomBtn.addEventListener('click', quranToBottom);

    programInfoPopup.addEventListener('click', closeProgramInfoPopup);
    programInfoBtn.addEventListener('click', () => { openProgramInfoPopup(programInfoPopup); });
    programInfoPopupCloseBtn.addEventListener('click', closeProgramInfoPopup);

    bookmarkListPopup.addEventListener('click', bookmarkListPopupClose);
    bookmarkListBtn.addEventListener('click', bookmarkListPopupOpen);
    bookmarkListPopupCloseBtn.addEventListener('click', bookmarkListPopupClose);

    openNavLeftBtn.addEventListener('click', openNavLeft);
    closeNavLeftBtn.addEventListener('click', closeNavLeft);
    quranVerses.addEventListener('swipeRight', openNavLeft);
    navLeft.addEventListener('swipeLeft', closeNavLeft);

    openNavRightBtn.addEventListener('click', openNavRight);
    closeNavRightBtn.addEventListener('click', closeNavRight);
    quranVerses.addEventListener('swipeLeft', openNavRight);
    navRight.addEventListener('swipeRight', closeNavRight);

    quranVerses.addEventListener('click', closeNavs);
  }

  function restoreSettings() {
    if (localStorage.getItem('bookmarks')) {
      fillBookmarkList();
      if (bookmarks[bookmarks.length - 1]?.target) gotoBookmark(bookmarks[bookmarks.length - 1].target);
    }

    if (localStorage.getItem('language')) {
      language = localStorage.getItem('language');
      languageList.value = language;
      setLanguage(language);
    }

    if (localStorage.getItem('fontFamily')) {
      fontFamily = localStorage.getItem('fontFamily');
      fontFamilyList.value = fontFamily;
      setFontFamily(fontFamily);
    }

    if (localStorage.getItem('fontSize')) {
      fontSize = localStorage.getItem('fontSize');
      fontSizeList.value = fontSize;
      setFontSize(fontSize);
    }

    if (localStorage.getItem('color')) {
      color = localStorage.getItem('color');
      colorList.value = color;
      setColor(color);
    }

    if (localStorage.getItem('bgColor')) {
      bgColor = localStorage.getItem('bgColor');
      bgColorList.value = bgColor;
      setBgColor(bgColor);
    }

    if (localStorage.getItem('sura_order')) {
      sura_order = localStorage.getItem('sura_order');
      fillSuras(currentLanguage, sura_order);
    }
  }

  function setLanguage(language) {
    setLabels(language);
    replaceBookmarksAndInfos(language);
    fillSuras(language);
    fillShortcuts(language);

    currentLanguage = language;
    localStorage.setItem('language', language);
    closeNavs();
  }

  function replaceBookmarksAndInfos(language) {
    for (let i = 0; i < juzAnchors.length; i++) {
      juzAnchors[i].textContent = juzAnchors[i].textContent.replace(
        translations[currentLanguage]['juz_anchor_label'],
        translations[language]['juz_anchor_label']
      );
    }

    for (let i = 0; i < pageAnchors.length; i++) {
      pageAnchors[i].textContent = pageAnchors[i].textContent.replace(
        translations[currentLanguage]['page_anchor_label'],
        translations[language]['page_anchor_label']
      );
    }

    for (let i = 0; i < pageInfos.length; i++) {
      pageInfos[i].textContent = pageInfos[i].textContent.replace(
        translations[currentLanguage]['page_info_page'],
        translations[language]['page_info_page']
      );
      pageInfos[i].textContent = pageInfos[i].textContent.replace(
        translations[currentLanguage]['page_info_juz'],
        translations[language]['page_info_juz']
      );
    }

    let bookmark = document.getElementById('bookmark');
    if (bookmark) {
      bookmark.textContent = bookmark.textContent.replace(
        translations[currentLanguage]['juz_anchor_label'],
        translations[language]['juz_anchor_label']
      );
      bookmark.textContent = bookmark.textContent.replace(
        translations[currentLanguage]['page_anchor_label'],
        translations[language]['page_anchor_label']
      );
    }
  }

  function setLabels(language) {
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

  function fillSelects() {
    createOptions(fontFamilyList, fontFamilies, defaultFontFamily);
    createOptions(fontSizeList, fontSizes, defaultFontSize);
    createOptions(colorList, colors, defaultColor);
    createOptions(bgColorList, bgColors, defaultBgColor);
    createOptions(languageList, languages, defaultLanguage);
    createOptions(juzList, ajza, null);
  }

  function createOptions(selectElement, options, defaultOption) {
    for (let [value, text] of Object.entries(options)) {
      let option = document.createElement('option');
      option.value = value;
      option.textContent = text;
      selectElement.appendChild(option);
      if (defaultOption == value) selectElement.value = value;
    }
  }

  function fillSuras(language, order = 'id') {
    while (child = suraList.lastChild) { suraList.removeChild(child); }

    let suras = order == 'id' ? translations[language]['suras_id_order'] : translations[language]['suras_az_order'];
    createOptions(suraList, suras, null);

    localStorage.setItem('sura_order', order);
  }

  function fillShortcuts(language) {
    let listElement = suraShortcutList;
    let listItems   = translations[language]['sura-shortcuts'];

    while (child = listElement.lastChild) { listElement.removeChild(child); }

    for (let [value, text] of Object.entries(listItems)) {
      let listItem = document.createElement('li');
      listItem.dataset.suraId = value;
      listItem.textContent    = text;
      listItem.addEventListener('click', () => { suraShortcutToTop(listItem); });
      listElement.appendChild(listItem);
    }
  }

  function bookmarksRead() {
    return JSON.parse(localStorage.getItem('bookmarks')) || [];
  }

  function bookmarksStore(bookmarks) {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }

  async function fillBookmarkList() {
    bookmarkContainer.innerHTML     = null;
    bookmarkListContent.innerHTML   = null;
    const bookmarks                 = bookmarksRead();
    let bookmarkElement;
    let bookmarkTarget;

    bookmarks.forEach(function(bookmark) {
      bookmarkTarget       = bookmark.target;
      bookmarkElement      = bookmarkElementCreate(bookmark);
      let bookmarkListItem = document.createElement('li');
      bookmarkListItem.appendChild(bookmarkElement);
      bookmarkListContent.appendChild(bookmarkListItem);
    });

    if (bookmarkElement) {
      const bookmarkButton = bookmarkElement.cloneNode(true);
      bookmarkButton.addEventListener('click', () => { gotoBookmark(bookmarkTarget); });
      bookmarkContainer.appendChild(bookmarkButton);
    }
  }

  function bookmarkAdd() {
    let type   = 'page';
    const target = this.id;
    const firstLetter = target.substr(0, 1);

    switch (firstLetter) {
      case 'p': type = 'page'; break;
      case 'j': type = 'juz';  break;
    }

    const label    = target.startsWith('v') ? this.dataset.label : this.textContent;
    const bookmark = { target: target, label: label, type: type };

    bookmarkPush(bookmark);
    fillBookmarkList();
  }

  function bookmarkPush(bookmark) {
    const bookmarks = bookmarksRead();
    if (bookmarks.length > 0 && bookmarks[bookmarks.length - 1].target === bookmark.target) return;

    bookmarks.push(bookmark);
    if (bookmarks.length > bookmarksLength) bookmarks.shift();
    bookmarksStore(bookmarks);
  }

  function bookmarkElementCreate(bookmark) {
    let oldBookmark = document.getElementById('bookmark-' + bookmark.target);
    if (oldBookmark) oldBookmark.remove();

    let bookmarkElement               = document.createElement('span');
    bookmarkElement.className         = 'bookmark';
    bookmarkElement.dataset.target    = bookmark.target;
    bookmarkElement.dataset.type      = bookmark.type;
    bookmarkElement.textContent       = bookmark.label;

    bookmarkElement.addEventListener('click', () => { gotoBookmark(bookmark.target); });

    return bookmarkElement;
  }

  function gotoBookmark(target) {
    closeNavs();
    document.getElementById(target).scrollIntoView();
    window.scrollBy(0, -navTop.offsetHeight);
  }

  function bookmarksRemove() {
    let answer = confirm(translations[currentLanguage]['confirm_delete_bookmark']);
    if (answer) {
      localStorage.removeItem('bookmarks');
      fillBookmarkList();
    }
  }

  async function bookmarkListPopupOpen() {
    closeNavs();
    bookmarkListPopup.classList.toggle('open');
  }

  function bookmarkListPopupClose() {
    closeNavs();
  }

  function settingLoading(showLoading) {
    if (showLoading) {
      navLoading.classList.add('open');
    } else {
      navLoading.classList.remove('open');
    }
  }

  function resetSettings() {
    let answer = confirm(translations[currentLanguage]['confirm_reset']);
    if (answer) {
      bgColorList.value    = defaultBgColor;
      colorList.value      = defaultColor;
      fontFamilyList.value = defaultFontFamily;
      fontSizeList.value   = defaultFontSize;
      languageList.value   = defaultLanguage;

      bgColorList.dispatchEvent(new Event('change', { 'bubbles': true }));
      colorList.dispatchEvent(new Event('change', { 'bubbles': true }));
      fontFamilyList.dispatchEvent(new Event('change', { 'bubbles': true }));
      fontSizeList.dispatchEvent(new Event('change', { 'bubbles': true }));
      languageList.dispatchEvent(new Event('change', { 'bubbles': true }));
    }
  }

  function closeNavs() {
    navLeft.classList.remove('open');
    navRight.classList.remove('open');
    bookmarkListPopup.classList.remove('open');
    programInfoPopup.classList.remove('open');
  }

  function closeNavLeft()  { navLeft.classList.remove('open'); }
  function closeNavRight() { navRight.classList.remove('open'); }

  function openNavLeft() {
    closeNavs();
    navLeft.classList.toggle('open');
  }

  function openNavRight() {
    bookmarkListPopup.classList.remove('open');
    navLeft.classList.remove('open');
    navRight.classList.toggle('open');
    programInfoPopup.classList.remove('open');
  }

  async function openProgramInfoPopup(e) {
    closeNavs();
    programInfoContent.innerHTML = await fetchLangHTML(currentLanguage, 'program_info');
    programInfoPopup.classList.toggle('open');
  }

  async function fetchLangHTML(language, file) {
    let result = '';
    let path   = 'languages/' + language + '/' + file + '.php?' + Date.now();
    await fetch(path).then(data => data.text()).then(txt => { result = txt; });
    return result;
  }

  function closeProgramInfoPopup() { programInfoPopup.classList.remove('open'); }

  function closeBookmarkListPopup()
  {
    bookmarkListPopup.classList.remove('open');
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
