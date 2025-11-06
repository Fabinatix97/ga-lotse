/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiBooleanWithUnknown, ApiTooth } from "@eshg/dental-api";

export function formatToothNumber(tooth: ApiTooth): string {
  return tooth.substring(1);
}

export function formatBooleanWithUnknown(
  value: ApiBooleanWithUnknown | undefined,
) {
  if (value === undefined) {
    return "";
  }

  switch (value) {
    case ApiBooleanWithUnknown.True:
      return "Ja";
    case ApiBooleanWithUnknown.False:
      return "Nein";
    case ApiBooleanWithUnknown.Unknown:
      return "Liegt nicht vor";
  }
}
