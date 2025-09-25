/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  FormatDurationOptions,
  GetWeekOptions,
  type Locale,
  addSeconds,
  format,
  formatDuration,
  formatISODuration,
  getWeek,
  intervalToDuration,
  isAfter,
  isBefore,
  parse,
  secondsToHours,
} from "date-fns";
// TODO: do not import all locales statically
import * as DateLocales from "date-fns/locale";
import { parse as parseDuration, toSeconds } from "iso8601-duration";

import {
  DATE_FORMAT,
  TIME_FORMAT,
  isDateString,
  isTimeString,
} from "@eshg/lib-portal";

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
  const duration = parseDuration(isoDuration);
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

export function secondToISODuration(second: number) {
  const baseline = new Date();
  return formatISODuration(
    intervalToDuration({ start: baseline, end: addSeconds(baseline, second) }),
  );
}

export function formatTimeInput(date: Date): string {
  return format(date, TIME_FORMAT);
}

export function formatDateInput(date: Date): string {
  return format(date, DATE_FORMAT);
}

export function isBeforeTime(
  startTime: string,
  endTime: string,
  referenceStartDate: Date = new Date(),
  referenceEndDate: Date = referenceStartDate,
) {
  const startDate = parseTime(startTime, referenceStartDate);
  const endDate = parseTime(endTime, referenceEndDate);
  return isBefore(startDate, endDate);
}

export function isAfterTime(
  startTime: string,
  endTime: string,
  referenceStartDate: Date = new Date(),
  referenceEndDate: Date = referenceStartDate,
) {
  const startDate = parseTime(startTime, referenceStartDate);
  const endDate = parseTime(endTime, referenceEndDate);
  return isAfter(startDate, endDate);
}

export function parseTime(time: string, referenceDate: Date = new Date()) {
  return parse(time, TIME_FORMAT, referenceDate);
}
