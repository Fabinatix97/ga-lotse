/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { EnumMap } from "@eshg/lib-portal/types/helpers";
import { ApiCertificateType } from "@eshg/travel-medicine-api";

export const CERTIFICATE_TYPES: EnumMap<ApiCertificateType> = {
  [ApiCertificateType.HealthInsurance]: "für die Krankenkasse",
};
