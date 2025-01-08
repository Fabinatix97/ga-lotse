/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ReportDataType } from "@/lib/businessModules/statistics/api/models/evaluationReports";

export const translateReportType = {
  [ReportDataType.Single]: "Einzel-Report",
  [ReportDataType.Child]: "Ausgabe",
  [ReportDataType.Series]: "Serie",
} satisfies Record<ReportDataType, string>;
