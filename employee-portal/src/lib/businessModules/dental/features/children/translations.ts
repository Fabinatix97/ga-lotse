/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiOralHygieneStatus } from "@eshg/dental-api";
import { EnumMap } from "@eshg/lib-portal/types/helpers";

export const ORAL_HYGIENE_STATUS_STATUS: EnumMap<ApiOralHygieneStatus> = {
  [ApiOralHygieneStatus.Excellent]: "Sehr gut",
  [ApiOralHygieneStatus.Good]: "Gut",
  [ApiOralHygieneStatus.Poor]: "Schlecht",
};
