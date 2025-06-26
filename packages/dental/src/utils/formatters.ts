/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiTooth } from "@eshg/dental-api";

export function formatToothNumber(tooth: ApiTooth): string {
  return tooth.substring(1);
}
