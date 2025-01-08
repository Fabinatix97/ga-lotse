/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { addDays, eachDayOfInterval, endOfMonth, startOfMonth } from "date-fns";

export const dateInMonthForm = Intl.DateTimeFormat(undefined, {
  day: "numeric",
  weekday: "long",
});

export function getMonthInterval(date: Date) {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  return { start, end };
}

export function getDaysInAndAroundMonth(interval: { start: Date; end: Date }) {
  let { start } = interval;
  const firstDayOfTheWeek = 1; // True for Germany
  const startDiff = start.getDay() - firstDayOfTheWeek;
  if (startDiff != 0) {
    start = addDays(start, (startDiff > 0 ? 0 : -7) - startDiff);
  }
  let days = eachDayOfInterval({ start, end: interval.end });
  const requiredPadding = Math.ceil(days.length / 7) * 7 - days.length;
  if (requiredPadding > 0) {
    const last = days[days.length - 1];
    const paddingDays = new Array(requiredPadding)
      .fill(last)
      .map((day: Date, index) => addDays(day, index + 1));
    days = [...days, ...paddingDays];
  }
  return days;
}

export const monthNameForm = Intl.DateTimeFormat(undefined, { month: "long" });

export function monthLabel(currentMonth: Date) {
  return `${monthNameForm.format(currentMonth)} ${currentMonth.getFullYear()}`;
}

const weekdaySortCodeForm = Intl.DateTimeFormat([], { weekday: "short" });
const startMonday = new Date("2024-09-30");
const weekdays = [1, 2, 3, 4, 5, 6, 7].map((d) => addDays(startMonday, d - 1));
export function getWeekdayShortCodes() {
  return weekdays.map((d) => weekdaySortCodeForm.format(d));
}

export const timeForm = Intl.DateTimeFormat(undefined, { timeStyle: "short" });
export const dateFullForm = Intl.DateTimeFormat(undefined, {
  month: "long",
  day: "numeric",
  weekday: "long",
  year: "numeric",
});
