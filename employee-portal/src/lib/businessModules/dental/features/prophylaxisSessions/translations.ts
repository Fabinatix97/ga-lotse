/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiDentitionType, ApiFluoridationVarnish } from "@eshg/dental-api";
import { EnumMap } from "@eshg/lib-portal/types/helpers";

export const DENTITION_TYPES: EnumMap<ApiDentitionType> = {
  [ApiDentitionType.Primary]: "Milchgebiss",
  [ApiDentitionType.Mixed]: "Wechselgebiss",
  [ApiDentitionType.Secondary]: "Bleibendes Gebiss",
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
