/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { EnumMap } from "@eshg/lib-portal/types/helpers";

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
  [ReportingPeriod.Year]: "Letzten 12 Monate",
};
