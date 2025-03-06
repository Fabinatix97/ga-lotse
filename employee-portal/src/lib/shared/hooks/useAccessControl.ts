/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiUserRole } from "@eshg/base-api";
import {
  AccessCheck,
  checkAccess,
  hasUserRole,
} from "@eshg/lib-employee-portal";

import { useGetSelfUserPermissions } from "@/lib/baseModule/api/queries/users";

export function useAccessControl() {
  const { data: selfUserPermissions } = useGetSelfUserPermissions();
  return (check: AccessCheck) =>
    checkAccess(check, { userRoles: selfUserPermissions });
}

export function useHasUserRoleCheck(userRole: ApiUserRole) {
  const checkAccess = useAccessControl();
  return checkAccess(hasUserRole(userRole));
}

export function useHasUserRolesCheck<const T extends ApiUserRole[]>(
  userRoles: T,
): { [_I in keyof T]: boolean } {
  const checkAccess = useAccessControl();
  return userRoles.map((userRole) => checkAccess(hasUserRole(userRole))) as any; // eslint-disable-line
}
