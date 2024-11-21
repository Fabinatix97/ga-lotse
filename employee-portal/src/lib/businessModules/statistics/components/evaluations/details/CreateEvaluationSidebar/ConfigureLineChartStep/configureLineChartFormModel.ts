/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DiagramAxisRange } from "@/lib/businessModules/statistics/api/models/statisticDetailsViewTypes";

export interface ConfigureLineChartFormModel {
  xAxis: string | null;
  yAxis: string | null;
  secondaryAttribute: string | null;
  axisRange: DiagramAxisRange;
}
