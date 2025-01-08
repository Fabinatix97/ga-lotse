/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiBusinessModule, ApiUserRole } from "@eshg/employee-portal-api/base";

import { ModuleUserGroupConfig } from "@/lib/baseModule/moduleRegister/moduleUserGroupResolver";

export const moduleUserGroup: ModuleUserGroupConfig = {
  group: "[System] Impfberatung",
  businessModule: ApiBusinessModule.TravelMedicine,
  leaderRole: ApiUserRole.TravelMedicineLeader,
};
