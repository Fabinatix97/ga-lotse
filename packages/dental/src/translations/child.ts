/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiBooleanWithUnknown } from "@eshg/dental-api";
import { EnumMap } from "@eshg/lib-portal";

export const FLUORIDATION_CONSENTED_VALUES: EnumMap<ApiBooleanWithUnknown> = {
  [ApiBooleanWithUnknown.True]: "Ja",
  [ApiBooleanWithUnknown.False]: "Nein",
  [ApiBooleanWithUnknown.Unknown]: "Liegt nicht vor",
};
