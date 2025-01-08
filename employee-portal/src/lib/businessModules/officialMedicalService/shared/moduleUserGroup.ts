/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiBusinessModule, ApiUserRole } from "@eshg/employee-portal-api/base";

import { ModuleUserGroupConfig } from "@/lib/baseModule/moduleRegister/moduleUserGroupResolver";

export const moduleUserGroup: ModuleUserGroupConfig = {
  group: `[System] Amtsärztlicher Dienst`,
  businessModule: ApiBusinessModule.OfficialMedicalService,
  leaderRole: ApiUserRole.OfficialMedicalServiceLeader,
};
