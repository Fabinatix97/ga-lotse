/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Locale,
  ar,
  de,
  enGB,
  es,
  faIR,
  fr,
  hr,
  it,
  pl,
  ro,
  ru,
  tr,
  uk,
} from "date-fns/locale";

import { supportedLanguages } from "@/lib/i18n/options";
import { useLang } from "@/lib/i18n/useLang";

type SupportedLanguagesKey = (typeof supportedLanguages)[number];

const SUPPORTED_LOCALES: Record<SupportedLanguagesKey, Locale> = {
  de: de,
  en: enGB,
  es: es,
  ar: ar,
  fa: faIR,
  fr: fr,
  hr: hr,
  it: it,
  pl: pl,
  prs: faIR, // there is no locale for Dari
  ro: ro,
  ru: ru,
  tr: tr,
  uk: uk,
};

export function useLocale(): Locale {
  const lang = useLang();
  return SUPPORTED_LOCALES[lang];
}
