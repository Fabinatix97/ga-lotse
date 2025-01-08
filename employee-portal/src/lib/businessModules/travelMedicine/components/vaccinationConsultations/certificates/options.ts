/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiCertificateType } from "@eshg/employee-portal-api/travelMedicine";
import { buildEnumOptions } from "@eshg/lib-portal/helpers/form";

import { CERTIFICATE_TYPES } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/certificates/translations";

export const CERTIFICATE_TYPE_OPTIONS = buildEnumOptions<ApiCertificateType>(
  CERTIFICATE_TYPES,
).filter((option) => option.value);
