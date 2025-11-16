import { closeNavs } from './navigation.js';
import { createOptions } from './utils.js';

export function initSettings(elements) {
  const { languageList, bgColorList, colorList, fontFamilyList, fontSizeList } = elements;

  languageList.addEventListener('change', () => setLanguage(languageList.value));
  bgColorList.addEventListener('change', () => setBgColor(bgColorList.value));
  colorList.addEventListener('change', () => setColor(colorList.value));
  fontFamilyList.addEventListener('change', () => setFontFamily(fontFamilyList.value));
  fontSizeList.addEventListener('change', () => setFontSize(fontSizeList.value));
}

export function restoreSettings(elements) {
  const { languageList, bgColorList, colorList, fontFamilyList, fontSizeList } = elements;

  if (localStorage.getItem('language')) setLanguage(localStorage.getItem('language'));
  if (localStorage.getItem('bgColor')) setBgColor(localStorage.getItem('bgColor'));
  if (localStorage.getItem('color')) setColor(localStorage.getItem('color'));
  if (localStorage.getItem('fontFamily')) setFontFamily(localStorage.getItem('fontFamily'));
  if (localStorage.getItem('fontSize')) setFontSize(localStorage.getItem('fontSize'));
}

export function setLanguage(lang) {
  document.documentElement.lang = lang;
  localStorage.setItem('language', lang);
  closeNavs();
}

export function setBgColor(color) {
  document.documentElement.style.setProperty('--set-bg-color', color);
  color === defaultBgColor ? localStorage.removeItem('bgColor') : localStorage.setItem('bgColor', color);
  closeNavs();
}

export function setColor(color) {
  document.documentElement.style.setProperty('--set-color', color);
  color === defaultColor ? localStorage.removeItem('color') : localStorage.setItem('color', color);
  closeNavs();
}

export function setFontFamily(family) {
  document.documentElement.style.setProperty('--set-font-family', family);
  family === defaultFontFamily ? localStorage.removeItem('fontFamily') : localStorage.setItem('fontFamily', family);
  closeNavs();
}

export function setFontSize(size) {
  document.documentElement.style.setProperty('--set-font-size', size);
  size === defaultFontSize ? localStorage.removeItem('fontSize') : localStorage.setItem('fontSize', size);
  closeNavs();
}
