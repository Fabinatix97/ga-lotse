/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  FormatDistanceToNowOptions,
  FormatDurationOptions,
  GetWeekOptions,
  format,
  formatDistanceStrict,
  formatDistanceToNow,
  formatDistanceToNowStrict,
  formatISO,
  getWeek,
  isBefore,
  isSameDay,
  parse,
  secondsToMilliseconds,
} from "date-fns";
import { parse as parseDuration, toSeconds } from "iso8601-duration";

import { getDateFnsLocale } from "@eshg/lib-employee-portal";
import {
  TIME_FORMAT,
  isDateString,
  isTimeString,
} from "@eshg/lib-portal/helpers/dateTime";

export function formatTimeInput(date: Date): string {
  return format(date, TIME_FORMAT);
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

export function parseTime(time: string, referenceDate: Date = new Date()) {
  return parse(time, TIME_FORMAT, referenceDate);
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

export function formatDurationRounded(
  isoDuration: string,
  options?: FormatDurationOptions,
) {
  const duration = parseDuration(isoDuration);
  return formatDistanceStrict(0, secondsToMilliseconds(toSeconds(duration)), {
    locale: options?.locale ?? getDateFnsLocale(),
    roundingMethod: "round",
  });
}

export function formatDateRangeNumeric(start: Date, end: Date) {
  return `${format(start, "dd.MM.yyyy")} – ${format(end, "dd.MM.yyyy")}`;
}

export function formatDateRange(start: Date, end: Date) {
  return new Intl.DateTimeFormat("de-DE", {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).formatRange(start, end);
}

export function formatDateTimeRange(
  start: Date,
  end: Date,
  onlyTimeIfSameDay = false,
) {
  if (isSameDay(start, end) && onlyTimeIfSameDay) {
    return new Intl.DateTimeFormat("de-DE", {
      hour: "numeric",
      minute: "numeric",
    }).formatRange(start, end);
  }
  return new Intl.DateTimeFormat("de-DE", {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).formatRange(start, end);
}

export function formatDateOrDateTimeRange({
  start,
  end,
  wholeDay,
}: {
  start: Date;
  end: Date;
  wholeDay: boolean;
}) {
  return wholeDay
    ? formatDateRange(start, end)
    : formatDateTimeRange(start, end);
}

export function formatDateTypeToISODate(date: Date) {
  return formatISO(date, {
    representation: "date",
  });
}

export function formatDateTimeRangeToNow(
  date: Date,
  options?: FormatDistanceToNowOptions,
) {
  return formatDistanceToNow(date, {
    locale: options?.locale ?? getDateFnsLocale(),
  });
}

export function formatDateTimeRangeToNowInMinutes(
  date: Date,
  options?: FormatDistanceToNowOptions,
) {
  return formatDistanceToNowStrict(date, {
    locale: options?.locale ?? getDateFnsLocale(),
    unit: "minute",
  });
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

export function formatDateToFullReadableStringWithShortenedWeekday(date: Date) {
  return new Intl.DateTimeFormat("de-DE", {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function formatDateTimeShortenedWeekday(date: Date) {
  return new Intl.DateTimeFormat("de-DE", {
    weekday: "short",
    year: "numeric",

    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "numeric",
  }).format(date);
}

export function formatDateToFullReadableString(date: Date) {
  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "full",
  }).format(date);
}

export function durationBetweenDatesInMinutes(start: Date, end: Date) {
  return (end.getTime() - start.getTime()) / 1000 / 60;
}
