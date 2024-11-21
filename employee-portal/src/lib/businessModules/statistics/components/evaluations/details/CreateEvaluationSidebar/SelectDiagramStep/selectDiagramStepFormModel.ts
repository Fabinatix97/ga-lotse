/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DiagramType } from "@/lib/businessModules/statistics/api/models/statisticDetailsViewTypes";

export interface SelectDiagramStepFormModel {
  diagramType: DiagramType;
}
