/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiBusinessModule, ApiUserRole } from "@eshg/base-api";
import { ModuleUserGroupConfig } from "@eshg/lib-employee-portal";

export const moduleUserGroup: ModuleUserGroupConfig = {
  group: "[System] Impfberatung",
  businessModule: ApiBusinessModule.TravelMedicine,
  leaderRole: ApiUserRole.TravelMedicineLeader,
};
