/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { EnumMap } from "@eshg/lib-portal";

export const ReportSeriesState = {
  Activated: "ACTIVATED",
  Deactivated: "DEACTIVATED",
} as const;
export type ReportSeriesState =
  (typeof ReportSeriesState)[keyof typeof ReportSeriesState];

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
  [ReportingPeriod.ThreeMonths]: "Letzte 3 Monate",
  [ReportingPeriod.HalfYear]: "Letzte 6 Monate",
  [ReportingPeriod.Year]: "Letzte 12 Monate",
};
