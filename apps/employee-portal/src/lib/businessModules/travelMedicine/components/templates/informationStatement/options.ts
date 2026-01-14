/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { buildEnumOptions } from "@eshg/lib-portal";
import { ApiInformationStatementTemplateState } from "@eshg/travel-medicine-api";

import { INFORMATION_STATEMENT_TEMPLATE_STATES } from "@/lib/businessModules/travelMedicine/components/templates/informationStatement/translations";

export const INFORMATION_STATEMENT_TEMPLATE_TYPE_OPTIONS =
  buildEnumOptions<ApiInformationStatementTemplateState>(
    INFORMATION_STATEMENT_TEMPLATE_STATES,
  ).filter((option) => option.value);
