/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ReportSeries,
  ReportSeriesItem,
  SingleReport,
} from "./evaluationReports";

export type ReportOverviewTableRow =
  | SingleReportOverview
  | ReportSeriesOverview
  | ReportSeriesItemOverview;

export type ReportSeriesOverview = Omit<
  ReportSeries,
  "description" | "subRows" | "status" | "isAllItemsDeleting"
> & { dataSourceName: string; subRows: ReportSeriesItemOverview[] };

export type SingleReportOverview = Omit<
  SingleReport,
  "description" | "datasetAmount" | "status"
> & { dataSourceName: string };

export type ReportSeriesItemOverview = Omit<
  ReportSeriesItem,
  "datasetAmount" | "status"
> & { dataSourceName: string };

export interface ReportsOverview {
  totalNumberOfElements: number;
  reports: (SingleReportOverview | ReportSeriesOverview)[];
}
