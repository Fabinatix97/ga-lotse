/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  DiagramGrouping,
  DiagramOrientation,
  DiagramScaling,
} from "@/lib/businessModules/statistics/api/models/evaluationDetailsViewTypes";

export interface ConfigureBarChartFormModel {
  primaryAttributeSelectionKey: string | null;
  secondaryAttributeSelectionKey: string | null;
  orientation: DiagramOrientation;
  grouping: DiagramGrouping;
  scaling: DiagramScaling;
}
