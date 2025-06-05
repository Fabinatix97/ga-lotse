/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Locale, de, enGB } from "date-fns/locale";

import { supportedLanguages } from "@/lib/i18n/options";
import { useLang } from "@/lib/i18n/useLang";

type SupportedLanguagesKey = (typeof supportedLanguages)[number];

const SUPPORTED_LOCALES: Record<SupportedLanguagesKey, Locale> = {
  de: de,
  en: enGB,
};

export function useLocale(): Locale {
  const lang = useLang();
  return SUPPORTED_LOCALES[lang];
}
