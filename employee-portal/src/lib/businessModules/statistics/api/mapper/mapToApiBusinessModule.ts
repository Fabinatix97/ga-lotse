/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiBusinessModule } from "@eshg/employee-portal-api/base";

export function mapToApiBusinessModule(businessModule: string) {
  return businessModule as ApiBusinessModule;
}
