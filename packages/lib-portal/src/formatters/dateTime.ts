/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { isSameDay } from "date-fns";
import { isNullish } from "remeda";

import { Nullable } from "../types/utility";

const DATE_FORMAT = {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
} satisfies Intl.DateTimeFormatOptions;

const TIME_FORMAT = {
  hour: "2-digit",
  minute: "2-digit",
} satisfies Intl.DateTimeFormatOptions;

const WEEKDAY_FORMAT = {
  weekday: "short",
} satisfies Intl.DateTimeFormatOptions;

const DATE_TIME_FORMAT = {
  ...DATE_FORMAT,
  ...TIME_FORMAT,
} satisfies Intl.DateTimeFormatOptions;

const WEEKDAY_DATE_TIME_FORMAT = {
  ...WEEKDAY_FORMAT,
  ...DATE_TIME_FORMAT,
} satisfies Intl.DateTimeFormatOptions;

export function formatDate(date: Nullable<Date>, locale?: string) {
  return format(date, DATE_FORMAT, locale);
}

export function formatDateTime(date: Nullable<Date>, locale?: string) {
  return format(date, DATE_TIME_FORMAT, locale);
}

export function formatWeekdayDateTime(date: Nullable<Date>, locale?: string) {
  return format(date, WEEKDAY_DATE_TIME_FORMAT, locale);
}

export function formatWeekdayDateTimeRange(
  start: Date,
  end: Date,
  locale?: string,
) {
  const endFormatted = isSameDay(start, end)
    ? formatTime(end, locale)
    : formatWeekdayDateTime(end, locale);
  return `${formatWeekdayDateTime(start, locale)} - ${endFormatted}`;
}

export function formatTime(date: Nullable<Date>, locale?: string) {
  return format(date, TIME_FORMAT, locale);
}

function format(
  date: Nullable<Date>,
  format: Intl.DateTimeFormatOptions,
  locale?: string,
) {
  if (isNullish(date)) {
    return "";
  }

  return new Intl.DateTimeFormat(locale, format).format(date);
}
