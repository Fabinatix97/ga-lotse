/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.keycloak;

public enum ModuleLeaderRole {
  INSPECTION_LEADER(EmployeePermissionRole.INSPECTION_LEADER),
  SCHOOL_ENTRY_LEADER(EmployeePermissionRole.SCHOOL_ENTRY_LEADER),
  TRAVEL_MEDICINE_LEADER(EmployeePermissionRole.TRAVEL_MEDICINE_LEADER),
  MEASLES_PROTECTION_LEADER(EmployeePermissionRole.MEASLES_PROTECTION_LEADER),
  STI_PROTECTION_LEADER(EmployeePermissionRole.STI_PROTECTION_LEADER);

  private final EmployeePermissionRole employeePermissionRole;

  ModuleLeaderRole(EmployeePermissionRole employeePermissionRole) {
    this.employeePermissionRole = employeePermissionRole;
  }

  public PermissionRole getEmployeePermissionRole() {
    return employeePermissionRole;
  }
}
