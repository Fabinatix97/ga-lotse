/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ReportSeries,
  ReportSeriesItem,
  SingleReport,
} from "./statisticReports";

export type ReportOverviewTableRow =
  | SingleReportOverview
  | ReportSeriesOverview
  | ReportSeriesItemOverview;

export type ReportSeriesOverview = Omit<
  ReportSeries,
  "description" | "subRows" | "status"
> & { subRows: ReportSeriesItemOverview[] };

export type SingleReportOverview = Omit<
  SingleReport,
  "description" | "datasetAmount" | "status"
>;

export type ReportSeriesItemOverview = Omit<
  ReportSeriesItem,
  "datasetAmount" | "status"
>;

export interface ReportsOverview {
  totalNumberOfElements: number;
  reports: (SingleReportOverview | ReportSeriesOverview)[];
}
