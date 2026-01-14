/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SupportedLanguage } from "@/lib/i18n/options";

import de from "./de/translation.json";
import en from "./en/translation.json";

export type BaseTranslation = typeof en & typeof de;

export const baseTranslations = {
  en,
  de,
} as const satisfies Record<SupportedLanguage, BaseTranslation>;
