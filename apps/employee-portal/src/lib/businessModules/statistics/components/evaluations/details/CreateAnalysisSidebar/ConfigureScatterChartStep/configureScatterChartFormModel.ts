/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DiagramAxisRange } from "@/lib/businessModules/statistics/api/models/evaluationDetailsViewTypes";

export interface ConfigureScatterChartFormModel {
  xAxis: string | null;
  yAxis: string | null;
  secondaryAttribute: string | null;
  axisRange: DiagramAxisRange;
  trendline: boolean;
}
