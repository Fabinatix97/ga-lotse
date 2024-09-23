/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiUserRole } from "@eshg/employee-portal-api/base";

import { useGetSelfUser } from "@/lib/baseModule/api/queries/users";
import { useHasUserRolesCheck } from "@/lib/shared/hooks/useAccessControl";

export function useStatisticRoleChecks() {
  const [isAdmin, canWrite] = useHasUserRolesCheck([
    ApiUserRole.StatisticsStatisticsAdmin,
    ApiUserRole.StatisticsStatisticsWrite,
  ]);
  const selfUser = useGetSelfUser().data;

  return {
    canDeleteStatistic: (creatorUserId: string) =>
      isAdmin || creatorUserId === selfUser.userId,
    canWrite: () => canWrite,
  };
}
