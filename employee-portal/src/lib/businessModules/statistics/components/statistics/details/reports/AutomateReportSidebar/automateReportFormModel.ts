/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { EnumMap } from "@eshg/lib-portal/types/helpers";
import { addMonths, getMonth, startOfMonth, startOfToday } from "date-fns";

function getStartOfNextMonth() {
  return addMonths(startOfMonth(startOfToday()), 1);
}

export function getFirstPossibleStartMonth() {
  return getMonth(getStartOfNextMonth()).toString();
}

export function getStartDateOptions() {
  const firstDate = getStartOfNextMonth();
  const dateOptions = [];
  for (let i = 0; i < 12; i++) {
    const date = addMonths(firstDate, i);
    dateOptions.push({
      label: formatDate(date, "DE"),
      value: getMonth(date).toString(),
    });
  }
  return dateOptions;
}

export const Interval = {
  Month: "MONTH",
  ThreeMonths: "THREE_MONTHS",
  HalfYear: "HALF_YEAR",
  Year: "YEAR",
} as const;
export type Interval = (typeof Interval)[keyof typeof Interval];

export const INTERVAL_TRANSLATION: EnumMap<Interval> = {
  [Interval.Month]: "Monatlich",
  [Interval.ThreeMonths]: "Alle 3 Monate",
  [Interval.HalfYear]: "Alle 6 Monate",
  [Interval.Year]: "Jährlich",
};

export const ReportingPeriod = {
  Month: "MONTH",
  ThreeMonths: "THREE_MONTHS",
  HalfYear: "HALF_YEAR",
  Year: "YEAR",
} as const;
export type ReportingPeriod =
  (typeof ReportingPeriod)[keyof typeof ReportingPeriod];

export const REPORTING_PERIOD_TRANSLATION: EnumMap<ReportingPeriod> = {
  [ReportingPeriod.Month]: "Letzter Monat",
  [ReportingPeriod.ThreeMonths]: "Letzten 3 Monate",
  [ReportingPeriod.HalfYear]: "Letzten 6 Monate",
  [ReportingPeriod.Year]: "Letztes Jahr",
};
export interface AutomateReportFormModel {
  name: string;
  description: string;
  interval: Interval;
  startMonth: string;
  reportingPeriod: ReportingPeriod;
}
