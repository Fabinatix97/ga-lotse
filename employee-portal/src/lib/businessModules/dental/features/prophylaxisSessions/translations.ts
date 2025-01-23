/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiFluoridationVarnish, ApiProphylaxisType } from "@eshg/dental-api";
import { EnumMap } from "@eshg/lib-portal/types/helpers";

export const PROPHYLAXIS_TYPES: EnumMap<ApiProphylaxisType> = {
  [ApiProphylaxisType.P1]: "P1 (mit FL/ mit und ohne U)",
  [ApiProphylaxisType.P2]: "P2 (mit FL)",
  [ApiProphylaxisType.P3]: "P3 (nur Unterrichtseinheit)",
  [ApiProphylaxisType.P4]: "P4 (Ernährung)",
  [ApiProphylaxisType.P5]: "P5 (P+3.FL)",
  [ApiProphylaxisType.P6]: "P6 (P+4.FL)",
  [ApiProphylaxisType.P7]: "P7 (nur Unterrichtseinheit)",
};

export const FLUORIDATION_VARNISH_TYPES: EnumMap<ApiFluoridationVarnish> = {
  [ApiFluoridationVarnish.A]: "A",
  [ApiFluoridationVarnish.B]: "B",
  [ApiFluoridationVarnish.C]: "C",
  [ApiFluoridationVarnish.D]: "D",
};

const FLUORIDATION_VARNISH_DESCRIPTION: EnumMap<ApiFluoridationVarnish> = {
  [ApiFluoridationVarnish.A]: "Lack A",
  [ApiFluoridationVarnish.B]: "Lack B",
  [ApiFluoridationVarnish.C]: "Lack C",
  [ApiFluoridationVarnish.D]: "Lack D",
};

export function fluoridationDescription(key?: ApiFluoridationVarnish) {
  return key ? FLUORIDATION_VARNISH_DESCRIPTION[key] : "Nein";
}
