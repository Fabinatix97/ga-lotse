/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiReportState } from "@eshg/employee-portal-api/statistics";

import {
  Interval,
  ReportSeriesState,
  ReportingPeriod,
} from "./reportSeriesTypes";

export const ReportDataType = {
  Single: "SINGLE",
  Child: "CHILD",
  Series: "SERIES",
} as const;
export type ReportDataType =
  (typeof ReportDataType)[keyof typeof ReportDataType];

export interface StatisticReports {
  statisticId: string;
  title: string;
  reports: ReportData[];
  activeSeries?: ActiveSeriesInfo;
}

export type ReportData = SingleReport | ReportSeries;

export type ReportTableRow = SingleReport | ReportSeries | ReportSeriesItem;

export interface SingleReport extends ReportBase {
  type: Extract<ReportDataType, "SINGLE">;
  description?: string;
  seriesId: string;
}

export interface ReportBase {
  reportId: string;
  name: string;
  timeRangeStart: Date;
  timeRangeEnd: Date;
  datasetAmount?: number;
  status: ApiReportState;
  type: Extract<ReportDataType, "SINGLE" | "CHILD">;
  userId: string;
}

export interface ReportSeries {
  subRows: ReportSeriesItem[];
  name: string;
  seriesId: string;
  timeRangeStart?: Date;
  timeRangeEnd?: Date;
  type: Extract<ReportDataType, "SERIES">;
  description?: string;
  userId: string;
  status: ReportSeriesState;
}

export interface ReportSeriesItem extends ReportBase {
  type: Extract<ReportDataType, "CHILD">;
}

export interface ActiveSeriesInfo {
  seriesId: string;
  name: string;
  description?: string;
  interval?: Interval;
  reportingPeriod?: ReportingPeriod;
  nextReport?: Date;
}
