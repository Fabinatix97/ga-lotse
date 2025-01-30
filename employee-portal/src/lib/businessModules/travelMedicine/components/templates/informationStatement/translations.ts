/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { EnumMap } from "@eshg/lib-portal/types/helpers";
import { ApiInformationStatementTemplateState } from "@eshg/travel-medicine-api";

export const INFORMATION_STATEMENT_TEMPLATE_STATES: EnumMap<ApiInformationStatementTemplateState> =
  {
    [ApiInformationStatementTemplateState.Draft]: "Entwurf",
    [ApiInformationStatementTemplateState.Final]: "Final",
  };

export function translateInformationStatementTemplateStateType(
  type: ApiInformationStatementTemplateState,
) {
  return INFORMATION_STATEMENT_TEMPLATE_STATES[type];
}
