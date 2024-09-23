/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiUserRole } from "@eshg/employee-portal-api/base";

export interface PermitCheck {
  type: "permit";
}
export interface AllOfCheck {
  type: "allOf";
  accessChecks: AccessCheck[];
}
export interface AnyOfCheck {
  type: "anyOf";
  accessChecks: AccessCheck[];
}
export interface UserRoleCheck {
  type: "userRole";
  userRole: ApiUserRole;
}

export type AccessCheck = PermitCheck | AllOfCheck | AnyOfCheck | UserRoleCheck;

export interface AccessCheckContext {
  userRoles: ApiUserRole[];
}

export function checkAccess(
  check: AccessCheck,
  context: AccessCheckContext,
): boolean {
  switch (check.type) {
    case "permit":
      return true;
    case "allOf":
      return check.accessChecks.every((subCheck) =>
        checkAccess(subCheck, context),
      );
    case "anyOf":
      return check.accessChecks.some((subCheck) =>
        checkAccess(subCheck, context),
      );
    case "userRole":
      return context.userRoles.includes(check.userRole);
  }
}

export function noCheck(): AccessCheck {
  return { type: "permit" };
}

export function hasUserRole(userRole: ApiUserRole): AccessCheck {
  return { type: "userRole", userRole };
}

export function hasAllUserRoles(
  ...userRoles: [ApiUserRole, ApiUserRole, ...ApiUserRole[]]
): AccessCheck {
  return { type: "allOf", accessChecks: userRoles.map(hasUserRole) };
}

export function hasAnyUserRoles(userRoles: ApiUserRole[]): AccessCheck {
  return { type: "anyOf", accessChecks: userRoles.map(hasUserRole) };
}
