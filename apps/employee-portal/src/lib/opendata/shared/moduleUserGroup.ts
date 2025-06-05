/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiUserRole } from "@eshg/base-api";
import { ModuleUserGroupConfig } from "@eshg/lib-employee-portal";

export const moduleUserGroup: ModuleUserGroupConfig = {
  group: "[System] Open Data",
  businessModule: undefined,
  leaderRole: ApiUserRole.OpenDataLeader,
};
