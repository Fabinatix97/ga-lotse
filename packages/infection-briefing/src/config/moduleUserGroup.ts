/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiBusinessModule, ApiUserRole } from "@eshg/base-api";
import { ModuleUserGroupConfig } from "@eshg/lib-employee-portal";

export const moduleUserGroup: ModuleUserGroupConfig = {
  group: "[System] Lebensmittelausweis",
  businessModule: ApiBusinessModule.InfectionBriefing,
  leaderRole: ApiUserRole.InfectionBriefingLeader,
};
