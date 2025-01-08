/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiMedicalHistoryTemplateState } from "@eshg/employee-portal-api/travelMedicine";
import { buildEnumOptions } from "@eshg/lib-portal/helpers/form";

import { MEDICAL_HISTORY_TEMPLATE_STATES } from "@/lib/businessModules/travelMedicine/components/templates/medicalHistory/translations";

export const MEDICAL_HISTORY_TEMPLATE_TYPE_OPTIONS =
  buildEnumOptions<ApiMedicalHistoryTemplateState>(
    MEDICAL_HISTORY_TEMPLATE_STATES,
  ).filter((option) => option.value);
