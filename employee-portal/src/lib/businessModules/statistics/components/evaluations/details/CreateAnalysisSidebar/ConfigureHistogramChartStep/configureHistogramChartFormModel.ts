/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  DiagramBinning,
  DiagramGrouping,
  DiagramScaling,
} from "@/lib/businessModules/statistics/api/models/evaluationDetailsViewTypes";

export interface ConfigureHistogramChartFormModel {
  primaryAttribute: string | null;
  secondaryAttribute: string | null;
  grouping: DiagramGrouping;
  scaling: DiagramScaling;
  binning: DiagramBinning;
  bins: number;
}
