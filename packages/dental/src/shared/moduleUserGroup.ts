/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiBusinessModule, ApiUserRole } from "@eshg/base-api";
import { ModuleUserGroupConfig } from "@eshg/lib-employee-portal/types/module";

export const moduleUserGroup: ModuleUserGroupConfig = {
  group: `[System] Zahnärztlicher Dienst`,
  businessModule: ApiBusinessModule.Dental,
  leaderRole: ApiUserRole.DentalLeader,
};
