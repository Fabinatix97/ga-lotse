/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { EnumMap } from "@eshg/lib-portal/types/helpers";
import { ApiMedicalHistoryTemplateState } from "@eshg/travel-medicine-api";

export const MEDICAL_HISTORY_TEMPLATE_STATES: EnumMap<ApiMedicalHistoryTemplateState> =
  {
    [ApiMedicalHistoryTemplateState.Draft]: "Entwurf",
    [ApiMedicalHistoryTemplateState.Final]: "Veröffentlicht",
  };

export function translateMedicalHistoryTemplateStateType(
  type: ApiMedicalHistoryTemplateState,
) {
  return MEDICAL_HISTORY_TEMPLATE_STATES[type];
}
