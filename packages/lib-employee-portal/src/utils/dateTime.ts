/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { type Locale } from "date-fns";
// TODO: do not import all locales statically
import * as DateLocales from "date-fns/locale";

/**
 * Gets the default date-fns Locale based on the user's browser settings
 * (defaults to German (i.e., 'de') if the Locale cannot be found)
 *
 * Used for date-fns locale option to localize date output
 *
 * @returns a date-fns Locale
 * @example dateFns.getWeek(date, { locale: getDateFnsLocale() })
 */
export function getDateFnsLocale(): Locale {
  const dateLocales: Record<string, Locale> = DateLocales;
  const localeFormattedBrowserLanguage =
    typeof navigator !== "undefined"
      ? navigator.language.replace("-", "")
      : "de";
  const dateLocale: Locale =
    dateLocales[localeFormattedBrowserLanguage] ?? DateLocales.de;

  return dateLocale;
}
