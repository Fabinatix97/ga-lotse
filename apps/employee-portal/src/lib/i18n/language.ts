/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiLanguage } from "@eshg/base-api";

export const defaultLang = "de";
export const supportedLanguages = [
  "de",
  "en",
  "es",
  "tr",
  "ru",
  "ar",
  "fr",
  "it",
  "pl",
  "ro",
  "uk",
  "hr",
  "fa",
  "prs",
] as const;

export const languageLabel: Record<SupportedLanguage, string> = {
  de: "Deutsch",
  en: "Englisch",
  es: "Spanisch",
  tr: "Türkisch",
  ru: "Russisch",
  ar: "Arabisch",
  fr: "Französisch",
  it: "Italienisch",
  pl: "Polnisch",
  ro: "Rumänisch",
  uk: "Ukrainisch",
  hr: "Kroatisch",
  fa: "Farsi",
  prs: "Dari",
};

export type SupportedLanguage = (typeof supportedLanguages)[number];

export function mapToApiLanguage(language: SupportedLanguage): ApiLanguage {
  switch (language) {
    case "de":
      return ApiLanguage.German;
    case "en":
      return ApiLanguage.English;
    case "es":
      return ApiLanguage.Spanish;
    case "tr":
      return ApiLanguage.Turkish;
    case "ru":
      return ApiLanguage.Russian;
    case "ar":
      return ApiLanguage.Arabic;
    case "fr":
      return ApiLanguage.French;
    case "it":
      return ApiLanguage.Italian;
    case "pl":
      return ApiLanguage.Polish;
    case "ro":
      return ApiLanguage.Romanian;
    case "uk":
      return ApiLanguage.Ukrainian;
    case "hr":
      return ApiLanguage.Croatian;
    case "fa":
      return ApiLanguage.Farsi;
    case "prs":
      return ApiLanguage.Dari;
  }
}
