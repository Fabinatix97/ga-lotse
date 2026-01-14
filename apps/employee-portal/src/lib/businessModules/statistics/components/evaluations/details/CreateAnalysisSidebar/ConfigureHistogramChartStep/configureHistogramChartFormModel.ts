/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { OptionalFieldValue } from "@eshg/lib-portal";

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
  minBin: OptionalFieldValue<number>;
  maxBin: OptionalFieldValue<number>;
}
