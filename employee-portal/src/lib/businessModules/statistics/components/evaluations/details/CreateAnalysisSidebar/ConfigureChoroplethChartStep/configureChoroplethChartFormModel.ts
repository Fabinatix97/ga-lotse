/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  DiagramCharacteristicParameter,
  DiagramColorScheme,
} from "@/lib/businessModules/statistics/api/models/evaluationDetailsViewTypes";

export interface ConfigureChoroplethChartFormModel {
  geoReferencedAttributeKey: string | null;
  secondaryAttributeSelectionKey: string | null;
  characteristicParameter: DiagramCharacteristicParameter;
  colorScheme: DiagramColorScheme;
  geoShapeId: string | null;
}
