/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ReportSeries, SingleReport } from "./statisticReports";

export type ReportForOverview =
  | Omit<SingleReport, "status" | "datasetAmount" | "description">
  | ReportSeries;

export interface ReportsOverview {
  totalNumberOfElements: number;
  reports: ReportForOverview[];
}
