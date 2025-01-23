/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiBusinessModule, ApiUserRole } from "@eshg/base-api";

export interface ModuleUserGroupConfig {
  group: `[System] ${string}`;
  /**
   * Not all modules are business modules in the sense that they have procedures and tasks.
   * For example, the Statistics module.
   * In such a case, the value of businessModule is undefined.
   */
  businessModule: ApiBusinessModule | undefined;
  leaderRole: ApiUserRole;
}
