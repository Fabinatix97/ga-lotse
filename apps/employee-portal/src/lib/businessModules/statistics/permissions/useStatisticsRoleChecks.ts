/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiUserRole } from "@eshg/base-api";
import {
  useGetSelfUser,
  useHasUserRolesCheck,
} from "@eshg/lib-employee-portal";

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
