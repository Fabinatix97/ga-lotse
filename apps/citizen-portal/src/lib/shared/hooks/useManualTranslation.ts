/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { SupportedLanguage } from "@/lib/i18n/options";
import { useLang } from "@/lib/i18n/useLang";

// given a map of language to translation, return the translation for the current language
export function useManualTranslation<
  TValue,
  TOptions extends Record<SupportedLanguage, TValue>,
  TFallbackLang extends SupportedLanguage = "de",
>(
  translations: TOptions,
  // the language to use if the translation for the current language is undefined
  fallbackLanguage?: TFallbackLang,
): TOptions[TFallbackLang] {
  const lang = useLang();
  return translations[lang] ?? translations[fallbackLanguage ?? "de"];
}
