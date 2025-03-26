/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiProphylaxisType } from "@eshg/dental-api";

export const PROPHYLAXIS_TYPES: Record<ApiProphylaxisType, string> = {
  [ApiProphylaxisType.P1]: "P1 (mit FL/ mit und ohne U)",
  [ApiProphylaxisType.P2]: "P2 (mit FL)",
  [ApiProphylaxisType.P3]: "P3 (nur Unterrichtseinheit)",
  [ApiProphylaxisType.P4]: "P4 (Ernährung)",
  [ApiProphylaxisType.P5]: "P5 (P+3.FL)",
  [ApiProphylaxisType.P6]: "P6 (P+4.FL)",
  [ApiProphylaxisType.P7]: "P7 (nur Unterrichtseinheit)",
};
