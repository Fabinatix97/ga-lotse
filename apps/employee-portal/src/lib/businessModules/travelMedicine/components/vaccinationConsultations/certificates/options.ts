/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { buildEnumOptions } from "@eshg/lib-portal";
import { ApiCertificateType } from "@eshg/travel-medicine-api";

import { CERTIFICATE_TYPES } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/certificates/translations";

export const CERTIFICATE_TYPE_OPTIONS = buildEnumOptions<ApiCertificateType>(
  CERTIFICATE_TYPES,
).filter((option) => option.value);
