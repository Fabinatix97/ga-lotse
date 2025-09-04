/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  FormatDurationOptions,
  GetWeekOptions,
  type Locale,
  addSeconds,
  formatDuration,
  formatISODuration,
  getWeek,
  intervalToDuration,
  secondsToHours,
} from "date-fns";
// TODO: do not import all locales statically
import * as DateLocales from "date-fns/locale";
import { parse, toSeconds } from "iso8601-duration";

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

export function formatDurationToHoursAndMinutes(
  isoDuration: string,
  options?: FormatDurationOptions,
) {
  const duration = parse(isoDuration);
  const minutes = duration.minutes;
  const hours = secondsToHours(toSeconds({ ...duration, minutes: 0 }));

  return hours === 0 && minutes === 0
    ? formatDuration(
        { minutes: 0 },
        { zero: true, locale: options?.locale ?? getDateFnsLocale() },
      )
    : formatDuration(
        { hours, minutes },
        {
          format: ["hours", "minutes"],
          locale: options?.locale ?? getDateFnsLocale(),
        },
      );
}

export function durationToSecond(isoDuration: string) {
  return toSeconds(parse(isoDuration));
}

export function secondToISODuration(second: number) {
  const baseline = new Date();
  return formatISODuration(
    intervalToDuration({ start: baseline, end: addSeconds(baseline, second) }),
  );
}
