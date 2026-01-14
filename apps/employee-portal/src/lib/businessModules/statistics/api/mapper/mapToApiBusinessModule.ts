/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiBusinessModule } from "@eshg/base-api";

export function mapToApiBusinessModule(businessModule: string) {
  return businessModule as ApiBusinessModule;
}
