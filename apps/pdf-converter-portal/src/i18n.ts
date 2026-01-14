/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

const locales: Record<string, Record<string, string>> = {
  de: {
    back: "Zurück",
    title: "PDF-nach-PDF/A-Konvertierer - GA-Lotse",
    header: "PDF-nach-PDF/A-Konvertierer",
    language_switch: "Sprachauswahl",
    drop_zone_info: "PDF Datei hier ablegen oder auswählen",
    file_selector_button: "PDF Datei auswählen",
    success: "Die Datei wurde erfolgreich konvertiert",
    download: "PDF/A Datei herunterladen",
    dismiss: "Datei Verwerfen",
    error: "Fehler während der PDF Konvertierung.",
    processing: "Die Datei wird gerade konvertiert.",
    processing_1: "Die PDF Konvertierung kann je nach Endgerät und Dateigröße einige Zeit (einige Minuten) in Anspruch nehmen.",
    info_text: "ⓘ Hinweis zum Konvertierungsprozess",
    info_text_1: "Die Konvertierung kann je nach Endgerät und Dateigröße einige Zeit (mehrere Minuten) dauern.",
    info_text_2: "Die Inhalte werden ggf. anders formatiert. Das liegt daran, dass nicht alle Schrifttypen und Funktionen von PDFs auch für PDF/A gelten und der Konvertierer sie daher nicht vollständig ausführen oder umwandeln kann.",
    info_text_3: "Bestimmte PDF Inahlte können nicht konvertiert werden, zum Beispiel engebettete Dateien.",
    info_text_4: "Das Ergebnis sollte daher vom Benutzenden überprüft werden.",
    info_text_success: "ⓘ Datei wurde erfolgreich konvertiert",
    info_text_error: "ⓘ Fehler während der Konvertierung",
    info_text_error_1: "Bitte brechen Sie den Prozess ab, indem Sie die Datei verwerfen und es erneut versuchen.",

    // footer
    imprint_link: "Impressum",
    privacy_link: "Datenschutzerklärung",
    accessibility_link: "Barrierefreiheit",
  },
  en: {
    back: "Back",
    title: "PDF-to-PDF/A-Converter - GA-Lotse",
    header: "PDF-to-PDF/A-Converter",
    language_switch: "Language Selection",
    drop_zone_info: "Select or drag and drop a PDF file here",
    file_selector_button: "Select PDF File",
    success: "The file has been successfully converted",
    download: "Download PDF/A file",
    dismiss: "Dismiss File",
    error: "Error during PDF conversion.",
    processing: "The file is currently being converted.",
    processing_1: "PDF conversion may take some time (several minutes) depending on your device and file size.",
    info_text: "ⓘ Note about the conversion process",
    info_text_1: "The conversion may take some time (several minutes) depending on your device and file size.",
    info_text_2: "The content may be formatted differently. This is because not all font types and PDF functions are also valid for PDF/A, so the converter may not be able to fully execute or convert them.",
    info_text_3: "Certain PDF content cannot be converted, for example, embedded files.",
    info_text_4: "The user should therefore review the result.",
    info_text_success: "ⓘ File has been successfully converted",
    info_text_error: "ⓘ Error during conversion",
    info_text_error_1: "Please abort the process by dismissing the file and try again.",

    // footer
    imprint_link: "Imprint",
    privacy_link: "Privacy policy",
    accessibility_link: "Accessibility",
  },
}

// @ts-expect-error Typescript doesn't know about global variables from IDs
const inputEn = window['lang-en'] as HTMLButtonElement;
// @ts-expect-error Typescript doesn't know about global variables from IDs
const inputDe = window['lang-de'] as HTMLButtonElement;

export function initI18n() {
  const lang = getLang();

  applyLocale(lang);
  inputEn.addEventListener('click', () => applyLocale("en"));
  inputDe.addEventListener('click', () => applyLocale("de"));
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

  if (lang === 'de') {
    inputEn.parentElement?.classList.remove('invisible');
    inputDe.parentElement?.classList.add('invisible');
  } else {
    lang = 'en';
    inputEn.parentElement?.classList.add('invisible');
    inputDe.parentElement?.classList.remove('invisible');
  }

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
