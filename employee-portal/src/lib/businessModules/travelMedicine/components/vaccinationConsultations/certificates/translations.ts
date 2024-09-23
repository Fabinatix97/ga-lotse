/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiCertificateType } from "@eshg/employee-portal-api/travelMedicine";
import { EnumMap } from "@eshg/lib-portal/types/helpers";

export const CERTIFICATE_TYPES: EnumMap<ApiCertificateType> = {
  [ApiCertificateType.HealthInsurance]: "für die Krankenkasse",
};
