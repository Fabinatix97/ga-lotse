/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DiagramType } from "@/lib/businessModules/statistics/api/models/evaluationDetailsViewTypes";

export interface SelectDiagramStepFormModel {
  diagramType: DiagramType;
}
