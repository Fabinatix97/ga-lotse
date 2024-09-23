/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiBusinessModule, ApiUserRole } from "@eshg/employee-portal-api/base";

import { moduleUserGroup as inspectionModuleUserGroup } from "@/lib/businessModules/inspection/shared/moduleUserGroup";
import { moduleUserGroup as measlesProtectionModuleUserGroup } from "@/lib/businessModules/measlesProtection/shared/moduleUserGroup";
import { moduleUserGroup as schoolEntryModuleUserGroup } from "@/lib/businessModules/schoolEntry/shared/moduleUserGroup";
import { moduleUserGroup as statisticsModuleUserGroup } from "@/lib/businessModules/statistics/shared/moduleUserGroup";
import { moduleUserGroup as stiProtectionModuleUserGroup } from "@/lib/businessModules/stiProtection/shared/moduleUserGroup";
import { moduleUserGroup as travelMedicineModuleUserGroup } from "@/lib/businessModules/travelMedicine/shared/moduleUserGroup";

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

export const businessModuleUserGroups: ModuleUserGroupConfig[] = [
  inspectionModuleUserGroup,
  measlesProtectionModuleUserGroup,
  schoolEntryModuleUserGroup,
  statisticsModuleUserGroup,
  travelMedicineModuleUserGroup,
  stiProtectionModuleUserGroup,
];

export const businessModuleLeaderRoles = businessModuleUserGroups.map(
  (config) => config.leaderRole,
);
