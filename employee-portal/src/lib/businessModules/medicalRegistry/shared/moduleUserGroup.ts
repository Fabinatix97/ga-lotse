/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiBusinessModule, ApiUserRole } from "@eshg/employee-portal-api/base";

import { ModuleUserGroupConfig } from "@/lib/baseModule/moduleRegister/moduleUserGroupResolver";

export const moduleUserGroup: ModuleUserGroupConfig = {
  group: "[System] Medizinalaufsicht",
  businessModule: ApiBusinessModule.MedicalRegistry,
  leaderRole: ApiUserRole.MedicalRegistryLeader,
};
