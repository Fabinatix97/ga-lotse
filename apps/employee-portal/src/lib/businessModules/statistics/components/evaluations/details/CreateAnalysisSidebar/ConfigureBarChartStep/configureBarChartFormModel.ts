/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  DiagramGrouping,
  DiagramOrientation,
  DiagramScaling,
} from "@/lib/businessModules/statistics/api/models/evaluationDetailsViewTypes";

export interface ConfigureBarChartFormModel {
  primaryAttribute: string | null;
  secondaryAttribute: string | null;
  orientation: DiagramOrientation;
  grouping: DiagramGrouping;
  scaling: DiagramScaling;
}
