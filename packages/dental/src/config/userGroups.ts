/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiBusinessModule, ApiUserRole } from "@eshg/base-api";
import { ModuleUserGroupConfig } from "@eshg/lib-employee-portal";

export const DentalUserGroup = {
  ModuleUser: "[System] Zahnärztlicher Dienst",
  Dentist: "[System] Zahnarzt",
  DentalAssistant: "[System] ZFA",
} as const satisfies Record<string, string>;

export const moduleUserGroup: ModuleUserGroupConfig = {
  group: DentalUserGroup.ModuleUser,
  businessModule: ApiBusinessModule.Dental,
  leaderRole: ApiUserRole.DentalLeader,
};
