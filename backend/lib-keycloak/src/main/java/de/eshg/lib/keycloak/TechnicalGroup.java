/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.keycloak;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public enum TechnicalGroup implements KeycloakGroup {
  DENTIST("Zahnarzt", EmployeePermissionRole.DENTAL_ADMIN),
  ZFA("ZFA", EmployeePermissionRole.DENTAL_ADMIN),
  SCHOOL_ENTRY_PHYSICIAN("ESU-Arzt", EmployeePermissionRole.SCHOOL_ENTRY_ADMIN),
  SCHOOL_ENTRY_MFA("ESU-MFA", EmployeePermissionRole.SCHOOL_ENTRY_ADMIN),
  SCHOOL_ENTRY_SOPASS("ESU-SOPASS", EmployeePermissionRole.SCHOOL_ENTRY_ADMIN),
  TRAVEL_MEDICINE_PHYSICIAN("RMBI-Arzt", EmployeePermissionRole.TRAVEL_MEDICINE_ADMIN),
  TRAVEL_MEDICINE_MFA("RMBI-MFA", EmployeePermissionRole.TRAVEL_MEDICINE_ADMIN),
  STI_PROTECTION_PHYSICIAN("HIV-STI-Arzt", EmployeePermissionRole.STI_PROTECTION_ADMIN),
  STI_PROTECTION_MFA("HIV-STI-MFA", EmployeePermissionRole.STI_PROTECTION_ADMIN),
  STI_PROTECTION_CONSULTANT("HIV-STI-Berater", EmployeePermissionRole.STI_PROTECTION_ADMIN),
  OFFICIAL_MEDICAL_SERVICE_PHYSICIANS(
      "AÄD-Arzt", EmployeePermissionRole.OFFICIAL_MEDICAL_SERVICE_ADMIN),
  MEDS_ABROAD_MFA("BTM-MFA", EmployeePermissionRole.MEDS_ABROAD_ADMIN),
  PROSTITUTE_PROTECTION_CONSULTANT(
      "ProstSchG-Berater", EmployeePermissionRole.PROSTITUTE_PROTECTION_ADMIN),
  INFECTION_BRIEFING_CONSULTANT("InfB-Berater", EmployeePermissionRole.INFECTION_BRIEFING_ADMIN);

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
