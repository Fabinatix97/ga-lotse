/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.keycloak;

public enum ModuleLeaderRole {
  INSPECTION_LEADER(EmployeePermissionRole.INSPECTION_LEADER),
  SCHOOL_ENTRY_LEADER(EmployeePermissionRole.SCHOOL_ENTRY_LEADER),
  TRAVEL_MEDICINE_LEADER(EmployeePermissionRole.TRAVEL_MEDICINE_LEADER),
  MEASLES_PROTECTION_LEADER(EmployeePermissionRole.MEASLES_PROTECTION_LEADER),
  STI_PROTECTION_LEADER(EmployeePermissionRole.STI_PROTECTION_LEADER),
  MEDICAL_REGISTRY_LEADER(EmployeePermissionRole.MEDICAL_REGISTRY_LEADER),
  DENTAL_LEADER(EmployeePermissionRole.DENTAL_LEADER),
  OFFICIAL_MEDICAL_SERVICE_LEADER(EmployeePermissionRole.OFFICIAL_MEDICAL_SERVICE_LEADER),
  MEDS_ABROAD_LEADER(EmployeePermissionRole.MEDS_ABROAD_LEADER);

  private final EmployeePermissionRole employeePermissionRole;

  ModuleLeaderRole(EmployeePermissionRole employeePermissionRole) {
    this.employeePermissionRole = employeePermissionRole;
  }

  public PermissionRole getEmployeePermissionRole() {
    return employeePermissionRole;
  }
}
