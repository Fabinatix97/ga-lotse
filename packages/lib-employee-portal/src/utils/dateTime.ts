/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { GetWeekOptions, type Locale, getWeek } from "date-fns";
// TODO: do not import all locales statically
import * as DateLocales from "date-fns/locale";

import { isDateString, isTimeString } from "@eshg/lib-portal";

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

export function formatCalendarWeek(date: Date, options?: GetWeekOptions) {
  const calendarWeek = getWeek(date, {
    locale: options?.locale ?? getDateFnsLocale(),
  });
  return `KW ${calendarWeek}`;
}

export function formatCalendarWeekRange(
  start: Date,
  end: Date,
  options?: GetWeekOptions,
) {
  const dateLocale = options?.locale ?? getDateFnsLocale();
  const startCalendarWeek = getWeek(start, {
    locale: dateLocale,
  });
  const endCalendarWeek = getWeek(end, {
    locale: dateLocale,
  });
  const multiWeek = startCalendarWeek !== endCalendarWeek;

  return `KW ${startCalendarWeek}${multiWeek ? ` - KW ${endCalendarWeek}` : ""}`;
}

/**
 * Creates a local dateTime from a date and time string
 *
 * @example toLocalDateTime('2000-01-01', '12:34')
 */
export function toLocalDateTime(date: string, time: string) {
  if (!isDateString(date)) {
    throw new Error(`Invalid date string '${date}'`);
  }
  if (!isTimeString(time)) {
    throw new Error(`Invalid time string '${time}'`);
  }
  return new Date(`${date}T${time}`);
}
