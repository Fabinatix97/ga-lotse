/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  differenceInYears,
  format,
  isAfter,
  isEqual,
  isMatch,
  secondsToMinutes,
} from "date-fns";
import { parse, toSeconds } from "iso8601-duration";

export const DATE_FORMAT = "yyyy-MM-dd";
export const DATE_TIME_FORMAT = "yyyy-MM-dd'T'HH:mm";
export const TIME_FORMAT = "HH:mm";
export const MONTH_FORMAT = "yyyy-MM";

export function isDateString(value: string) {
  return isMatch(value, DATE_FORMAT);
}

export function isTimeString(value: string) {
  return isMatch(value, TIME_FORMAT);
}

export function isDateTimeString(value: string) {
  return isMatch(value, DATE_TIME_FORMAT);
}

export function isMonthString(value: string) {
  return isMatch(value, MONTH_FORMAT);
}

export function toDateString(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function toDateTimeString(date: Date): string {
  return format(date, DATE_TIME_FORMAT);
}

/**
 * Creates a UTC date from a date string
 *
 * This is a workaround ensuring that the original date is sent to the backend when the generated
 * API clients use "date.toISOString().substring(0,10)" to serialize date objects.
 *
 * @example toUtcDate('2000-01-01')
 */
export function toUtcDate(date: string) {
  if (!isDateString(date)) {
    throw new Error(`Invalid date string '${date}'`);
  }
  return new Date(`${date}T00:00:00Z`);
}

export function durationBetweenDatesInMinutes(start: Date, end: Date) {
  return (end.getTime() - start.getTime()) / 1000 / 60;
}

export function formatDateToFullReadableString(date: Date, locale = "de-DE") {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "full",
  }).format(date);
}

export function formatDateToYear(date: Date, locale = "de-DE") {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "short",
  }).format(date);
}

export function calculateAge(
  dateOfBirth: Date,
  referenceDate: Date = new Date(),
): number {
  return differenceInYears(referenceDate, dateOfBirth);
}

export function isAdult(dateOfBirth: Date): boolean {
  return calculateAge(dateOfBirth) >= 18;
}

export function isDateCurrentDateOrGreater(date: Date) {
  const now = new Date();
  return isEqual(date, now) || isAfter(date, now); //filter out dates that are not at least
}

export function durationToSecond(isoDuration: string) {
  return toSeconds(parse(isoDuration));
}

export function durationToMinutes(isoDuration: string) {
  return secondsToMinutes(durationToSecond(isoDuration));
}
