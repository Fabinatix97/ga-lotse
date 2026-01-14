/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiUserRole } from "@eshg/base-api";

import { useGetSelfUserPermissions } from "../api/queries";
import { AccessCheck, checkAccess, hasUserRole } from "../utils/accessChecks";

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
