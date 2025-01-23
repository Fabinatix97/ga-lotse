/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { moduleUserGroup as dentalModuleUserGroup } from "@eshg/dental/shared/moduleUserGroup";
import { ModuleUserGroupConfig } from "@eshg/lib-employee-portal/types/module";

import { moduleUserGroup as inspectionModuleUserGroup } from "@/lib/businessModules/inspection/shared/moduleUserGroup";
import { moduleUserGroup as measlesProtectionModuleUserGroup } from "@/lib/businessModules/measlesProtection/shared/moduleUserGroup";
import { moduleUserGroup as officialMedicalServiceModuleUserGroup } from "@/lib/businessModules/officialMedicalService/shared/moduleUserGroup";
import { moduleUserGroup as schoolEntryModuleUserGroup } from "@/lib/businessModules/schoolEntry/shared/moduleUserGroup";
import { moduleUserGroup as statisticsModuleUserGroup } from "@/lib/businessModules/statistics/shared/moduleUserGroup";
import { moduleUserGroup as stiProtectionModuleUserGroup } from "@/lib/businessModules/stiProtection/shared/moduleUserGroup";
import { moduleUserGroup as travelMedicineModuleUserGroup } from "@/lib/businessModules/travelMedicine/shared/moduleUserGroup";

export const businessModuleUserGroups: ModuleUserGroupConfig[] = [
  inspectionModuleUserGroup,
  measlesProtectionModuleUserGroup,
  schoolEntryModuleUserGroup,
  statisticsModuleUserGroup,
  travelMedicineModuleUserGroup,
  stiProtectionModuleUserGroup,
  dentalModuleUserGroup,
  officialMedicalServiceModuleUserGroup,
];

export const businessModuleLeaderRoles = businessModuleUserGroups.map(
  (config) => config.leaderRole,
);
