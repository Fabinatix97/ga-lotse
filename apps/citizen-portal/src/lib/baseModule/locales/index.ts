/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SupportedLanguage } from "@/lib/i18n/options";

import de from "./de/translation.json";
import en from "./en/translation.json";

const es = {};
const tr = {};
const ru = {};
const ar = {};
const fr = {};
const it = {};
const pl = {};
const ro = {};
const uk = {};
const hr = {};
const fa = {};
const prs = {};

export type BaseTranslation = Partial<
  typeof en &
    typeof de &
    typeof es &
    typeof tr &
    typeof ru &
    typeof ar &
    typeof fr &
    typeof it &
    typeof pl &
    typeof ro &
    typeof uk &
    typeof hr &
    typeof fa &
    typeof prs
>;

const baseTranslations = {
  en,
  de,
  es,
  tr,
  ru,
  ar,
  fr,
  it,
  pl,
  ro,
  uk,
  hr,
  fa,
  prs,
} as const satisfies Record<SupportedLanguage, BaseTranslation>;

export function getBaseTranslation(lang: SupportedLanguage, path: string) {
  const result = path.split(".").reduce((accumulator, key) => {
    if (accumulator && key in accumulator) {
      // eslint-disable-next-line
      return (accumulator as any)[key];
    }
    return undefined;
  }, baseTranslations[lang] as object) as unknown as string | undefined;

  if (!result) {
    if (lang !== "de") {
      return getBaseTranslation("de", path);
    }

    return path;
  }

  return result;
}
