/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiMedicalHistoryTemplateState } from "@eshg/employee-portal-api/travelMedicine";
import { EnumMap } from "@eshg/lib-portal/types/helpers";

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
