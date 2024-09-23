/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiReportState } from "@eshg/employee-portal-api/statistics";

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
  reports: SingleReport[]; //TODO replace with ReportData[] once series are allowed
}

export type ReportData = SingleReport | ReportSeries;

export interface SingleReport extends ReportBase {
  seriesId: string;
  type: Extract<ReportDataType, "SINGLE">;
  description?: string;
}

export interface ReportBase {
  reportId: string;
  name: string;
  timeRangeStart: Date;
  timeRangeEnd: Date;
  datasetAmount?: number;
  status: ApiReportState;
  type: Extract<ReportDataType, "SINGLE" | "CHILD">;
}

export interface ReportSeries {
  reports: ReportSeriesItem[];
  name: string;
  seriesId: string;
  timeRangeStart?: Date;
  timeRangeEnd?: Date;
  type: Extract<ReportDataType, "SERIES">;
}

export interface ReportSeriesItem extends ReportBase {
  type: Extract<ReportDataType, "CHILD">;
}
