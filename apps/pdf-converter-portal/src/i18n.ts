/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

const locales: Record<string, Record<string, string>> = {
  de: {
    title: "PDF nach PDF/A-Konvertierer - GA-Lotse",
    header: "PDF nach PDF/A-Konvertierer",
    language_switch: "Sprachauswahl",
    drop_zone_info: "PDF-Datei hier ablegen oder auswählen",
    file_selector_button: "PDF-Datei auswählen",
    close: "Schließen",
    dismiss: "Verwerfen",
    error: "Fehler wärend der PDF Konvertierung.",
    processing: "Wird konvertiert...",
    pdfa_info_text: "PDF/A ist eine spezielle Art von PDF-Datei, die für die Langzeitarchivierung und -aufbewahrung entwickelt wurde. Stellen Sie es sich als die \"Archivversion\" einer normalen PDF vor – es ist darauf ausgelegt, Jahrzehnte zu überdauern, ohne an Qualität zu verlieren oder unlesbar zu werden.",

    // footer
    imprint_link: "Impressum",
    privacy_policy_link: "Datenschutzerklärung",
    accessibility_link: "Barrierefreiheit",
  },
  en: {
    title: "PDF to PDF/A Converter - GA-Lotse",
    header: "PDF to PDF/A Converter",
    language_switch: "Language Selection",
    drop_zone_info: "Select or drag and drop a PDF file here",
    file_selector_button: "Select PDF File",
    close: "Close",
    dismiss: "Dismiss",
    error: "Error during PDF conversion.",
    processing: "Processing...",
    pdfa_info_text: "PDF/A is a special type of PDF file designed for long-term storage and preservation. Think of it as the \"archival version\" of a regular PDF – it's built to last decades without losing quality or becoming unreadable.",

    // footer
    imprint_link: "Imprint",
    privacy_policy_link: "Privacy policy",
    accessibility_link: "Accessibility",
  },
}

// @ts-expect-error Typescript doesn't know about global variables from IDs
const languageSwitch = window['language-switch'] as HTMLFieldSetElement;
// @ts-expect-error Typescript doesn't know about global variables from IDs
const inputEn = window['lang-en'] as HTMLInputElement;
// @ts-expect-error Typescript doesn't know about global variables from IDs
const inputDe = window['lang-de'] as HTMLInputElement;

function toggleLanguageSwitch(e: Event) {
  if (e?.target instanceof HTMLInputElement) {
    applyLocale(e.target.value);
  }
}

export function initI18n() {
  const lang = getLang();

  if (lang === 'de') {
    inputDe.checked = true;
  }

  const locale = locales[lang];
  if (!locale) {
    return;
  }

  applyLocale(lang);
  inputEn.addEventListener('change', (e) => toggleLanguageSwitch(e));
  inputDe.addEventListener('change', (e) => toggleLanguageSwitch(e));
}

function getLang() {
  let lang = localStorage.getItem('lang');
  lang ??= navigator.language;
  lang = lang.split('-')[0]!;

  return lang;
}

function applyLocale(lang: string) {
  localStorage.setItem('lang', lang);
  const locale = locales[lang];
  if (!locale) {
    return;
  }
  languageSwitch.ariaLabel = locale.language_switch!;

  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n')!;
    const value = locale[key];
    if (!value) {
      // eslint-disable-next-line no-console
      console.warn(`Missing translation for key ${key}`);
      return;
    }
    el.childNodes.forEach(child => {
      if (child instanceof Text && !!child.textContent?.trim()) {
        child.textContent = value;
      }
    })
  });
}
