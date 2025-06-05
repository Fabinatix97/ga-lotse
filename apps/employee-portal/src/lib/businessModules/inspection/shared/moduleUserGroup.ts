/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiBusinessModule, ApiUserRole } from "@eshg/base-api";
import { ModuleUserGroupConfig } from "@eshg/lib-employee-portal";

export const moduleUserGroup: ModuleUserGroupConfig = {
  group: "[System] Begehung",
  businessModule: ApiBusinessModule.Inspection,
  leaderRole: ApiUserRole.InspectionLeader,
};
