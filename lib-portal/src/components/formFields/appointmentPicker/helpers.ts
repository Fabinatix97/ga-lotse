/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  isSameSecond,
  isWithinInterval,
  startOfMonth,
} from "date-fns";

import { Appointment } from "./AppointmentPickerField";

export function dateInMonthForm(locale: string) {
  return Intl.DateTimeFormat(locale, {
    day: "numeric",
    weekday: "long",
  });
}

export function getMonthInterval(date: Date) {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  return { start, end };
}
const allWeekdays = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const satisfies Weekday[];
export function getDaysInAndAroundMonth(
  interval: { start: Date; end: Date },
  {
    showWeekdays,
    padDays = true,
  }: { showWeekdays?: Weekday[]; padDays?: boolean } = {},
) {
  const daysInWeek = showWeekdays?.length ?? 7;
  const weekdayValues: number[] = getWeekdayValues(showWeekdays);
  const firstDayOfTheWeek = weekdayValues[0]; // True for Germany

  let start =
    eachDayOfInterval(interval).find((d) =>
      weekdayValues.includes(d.getDay()),
    ) ?? interval.start;

  if (firstDayOfTheWeek == null) {
    throw Error("showWeekdays must include at least one day");
  }

  const startDiff = start.getDay() - firstDayOfTheWeek;
  if (startDiff != 0) {
    start = addDays(start, (startDiff > 0 ? 0 : -daysInWeek) - startDiff);
  }
  let days = eachDayOfInterval({ start, end: interval.end })
    .filter((date) => weekdayValues.includes(date.getDay()))
    .map((d) => (padDays || isWithinInterval(d, interval) ? d : null));

  const requiredPadding =
    Math.ceil(days.length / daysInWeek) * daysInWeek - days.length;
  if (requiredPadding > 0 && padDays) {
    const last = days[days.length - 1];
    const paddingDays = new Array(requiredPadding)
      .fill(last)
      .map((day: Date, index) => addDays(day, index + 1));
    days = [...days, ...paddingDays];
  }
  return days;
}

export function monthNameForm(locale: string) {
  return Intl.DateTimeFormat(locale, { month: "long" });
}

export function monthLabel(currentMonth: Date, locale: string) {
  return `${monthNameForm(locale).format(currentMonth)} ${currentMonth.getFullYear()}`;
}

function weekdaySortCodeForm(locale: string) {
  return Intl.DateTimeFormat(locale, { weekday: "short" });
}
const startMonday = new Date("2024-09-30");
export type Weekday =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

const weekdays = [1, 2, 3, 4, 5, 6, 0].map((_, d) => addDays(startMonday, d));
const weekdayValueMap = {
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
  sunday: 0,
} as const satisfies Record<Weekday, number>;

function getWeekdayValues(givenDays: Weekday[] = allWeekdays) {
  return givenDays.map((t) => weekdayValueMap[t]);
}

export function getWeekdayShortCodes(locale: string, showWeekdays?: Weekday[]) {
  const showWeekdayValues = new Set(getWeekdayValues(showWeekdays));

  return weekdays
    .filter((d) => (showWeekdayValues as Set<number>).has(d.getDay()))
    .map((d) => weekdaySortCodeForm(locale).format(d));
}

// Trim leading zero if there is another number following it
export function trimLeadingZero(chars: string) {
  if (chars.startsWith("0") && !isNaN(Number(chars[1]))) {
    return chars.slice(1);
  }
  return chars;
}

export function formatTime(date: Date, locale: string, trimLeading?: boolean) {
  const formatted = date.toLocaleTimeString(locale, { timeStyle: "short" });
  if (trimLeading && ["de", "en"].some((l) => locale.startsWith(l))) {
    return trimLeadingZero(formatted);
  }
  return formatted;
}

export function dateFullForm(locale: string) {
  return Intl.DateTimeFormat(locale, {
    month: "long",
    day: "numeric",
    weekday: "long",
    year: "numeric",
  });
}

export function isSameAppointment(
  apt1: Appointment | null,
  apt2: Appointment | null,
) {
  if (apt1 === apt2) {
    return true;
  }
  if (apt1 == null || apt2 == null) {
    return false;
  }
  if (!isSameSecond(apt1.start, apt2.start)) {
    return false;
  }
  if (apt1.end === apt2.end) {
    return true;
  }
  if (apt1.end == null || apt2.end == null) {
    return false;
  }
  return isSameSecond(apt1.end, apt2.end);
}
