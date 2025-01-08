/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.keycloak;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public enum TechnicalGroup implements KeycloakGroup {
  SCHOOL_ENTRY_PHYSICIAN("ESU-Arzt", EmployeePermissionRole.SCHOOL_ENTRY_ADMIN),
  SCHOOL_ENTRY_MFA("ESU-MFA", EmployeePermissionRole.SCHOOL_ENTRY_ADMIN),
  TRAVEL_MEDICINE_PHYSICIAN("RMBI-Arzt", EmployeePermissionRole.TRAVEL_MEDICINE_ADMIN),
  TRAVEL_MEDICINE_MFA("RMBI-MFA", EmployeePermissionRole.TRAVEL_MEDICINE_ADMIN),
  STI_PROTECTION_PHYSICIANS("HIV-STI-Arzt", EmployeePermissionRole.STI_PROTECTION_PHYSICIAN),
  STI_PROTECTION_MFAS("HIV-STI-MFA", EmployeePermissionRole.STI_PROTECTION_MFA),
  STI_PROTECTION_CONSULTANTS("HIV-STI-Berater", EmployeePermissionRole.STI_PROTECTION_CONSULTANT),
  OFFICIAL_MEDICAL_SERVICE_PHYSICIANS(
      "AÄD-Arzt", EmployeePermissionRole.OFFICIAL_MEDICAL_SERVICE_ADMIN);

  private final List<KeycloakRole> roles;
  private final String name;

  TechnicalGroup(String name, KeycloakRole... permissionRoles) {
    this.name = name;
    this.roles = Collections.unmodifiableList(Arrays.asList(permissionRoles));
  }

  @Override
  public String getKeycloakNameWithoutPrefix() {
    return name;
  }

  @Override
  public List<KeycloakRole> roles() {
    return roles;
  }
}
