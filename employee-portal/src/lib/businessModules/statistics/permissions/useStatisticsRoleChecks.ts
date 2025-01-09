/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiUserRole } from "@eshg/employee-portal-api/base";

import { useGetSelfUser } from "@/lib/baseModule/api/queries/users";
import { useHasUserRolesCheck } from "@/lib/shared/hooks/useAccessControl";

export function useStatisticsRoleChecks() {
  const [isAdmin, canWrite] = useHasUserRolesCheck([
    ApiUserRole.StatisticsStatisticsAdmin,
    ApiUserRole.StatisticsStatisticsWrite,
  ]);
  const selfUser = useGetSelfUser().data;

  function isAdminOrOwner(creatorUserId: string | undefined) {
    return isAdmin || creatorUserId === selfUser.userId;
  }

  return {
    canDelete: isAdminOrOwner,
    canUpdateEvaluation: isAdminOrOwner,
    canUpdateEvaluationTemplate: isAdminOrOwner,
    canDeleteEvaluationTemplate: isAdminOrOwner,
    canWrite: () => canWrite,
  };
}
