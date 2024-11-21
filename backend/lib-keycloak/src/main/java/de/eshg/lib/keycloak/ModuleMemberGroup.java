/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.keycloak;

import java.util.ArrayList;
import java.util.List;

public enum ModuleMemberGroup implements KeycloakGroup {
  INSPECTION("Begehung", getStandardRoles(), getStandardInspectionRoles()),
  INSPECTION_CHECKLISTS(
      "Begehung Checklistenverwaltung",
      INSPECTION.roles(),
      List.of(
          EmployeePermissionRole.INSPECTION_OBJECTTYPES_WRITE,
          EmployeePermissionRole.INSPECTION_CHECKLISTDEFINITIONS_WRITE,
          EmployeePermissionRole.INSPECTION_CENTRALREPOSITORY_READ,
          EmployeePermissionRole.INSPECTION_CENTRALREPOSITORY_WRITE)),
  INSPECTION_LANDESAMT(
      "Begehung Mitarbeiter Landesamt",
      EmployeePermissionRole.BASE_CONTACTS_WRITE,
      EmployeePermissionRole.CHAT_MANAGEMENT_WRITE,
      EmployeePermissionRole.INSPECTION_NOTIFICATIONS_READ,
      EmployeePermissionRole.INSPECTION_CHECKLISTDEFINITIONS_WRITE,
      EmployeePermissionRole.INSPECTION_CORECHECKLISTDEFINITIONS_EDIT,
      EmployeePermissionRole.INSPECTION_CENTRALREPOSITORY_WRITE,
      EmployeePermissionRole.INSPECTION_CENTRALREPOSITORY_DELETE,
      EmployeePermissionRole.INSPECTION_CENTRALREPOSITORY_WRITE_CORECHECKLISTS),
  SCHOOL_ENTRY(
      "Einschulungsuntersuchung",
      getStandardRoles(),
      List.of(EmployeePermissionRole.SCHOOL_ENTRY_ADMIN)),
  TRAVEL_MEDICINE(
      "Impfberatung",
      getStandardRoles(),
      List.of(
          EmployeePermissionRole.BASE_CONTACTS_WRITE,
          EmployeePermissionRole.TRAVEL_MEDICINE_ADMIN)),
  MEASLES_PROTECTION(
      "Masernschutz",
      getStandardRoles(),
      List.of(
          EmployeePermissionRole.BASE_CONTACTS_WRITE,
          EmployeePermissionRole.MEASLES_PROTECTION_ADMIN)),
  STATISTICS(
      "Statistik",
      EmployeePermissionRole.STATISTICS_STATISTICS_READ,
      EmployeePermissionRole.STATISTICS_STATISTICS_WRITE),
  STI_PROTECTION(
      "HIV-STI-Schutz", getStandardRoles(), List.of(EmployeePermissionRole.STI_PROTECTION_USER)),
  MEDICAL_REGISTRY(
      "Medizinalkartei",
      getStandardRoles(),
      List.of(EmployeePermissionRole.MEDICAL_REGISTRY_ADMIN)),
  DENTAL("Zahnärztlicher Dienst", getStandardRoles(), List.of(EmployeePermissionRole.DENTAL_ADMIN)),
  OPEN_DATA("Open Data", EmployeePermissionRole.OPEN_DATA_ADMIN);

  private final String keycloakNameWithoutPrefix;
  private final List<EmployeePermissionRole> roles;

  ModuleMemberGroup(String keycloakNameWithoutPrefix, EmployeePermissionRole... roles) {
    this(keycloakNameWithoutPrefix, List.of(roles));
  }

  @SafeVarargs
  ModuleMemberGroup(String keycloakNameWithoutPrefix, List<EmployeePermissionRole>... roles) {
    this.keycloakNameWithoutPrefix = keycloakNameWithoutPrefix;

    List<EmployeePermissionRole> rolesTemp =
        new ArrayList<>(); // avoids heap pollution warning here
    for (List<EmployeePermissionRole> r : roles) {
      rolesTemp.addAll(r);
    }
    this.roles = rolesTemp;
  }

  private static List<EmployeePermissionRole> getStandardRoles() {
    return List.of(
        EmployeePermissionRole.BASE_TASKS_READ,
        EmployeePermissionRole.BASE_PROCEDURES_READ,
        EmployeePermissionRole.CHAT_MANAGEMENT_WRITE,
        EmployeePermissionRole.BASE_GDPR_PROCEDURE_REVIEW);
  }

  private static List<EmployeePermissionRole> getStandardInspectionRoles() {
    return List.of(
        EmployeePermissionRole.BASE_CONTACTS_WRITE,
        EmployeePermissionRole.BASE_FACILITIES_WRITE,
        EmployeePermissionRole.BASE_INVENTORY_USE,
        EmployeePermissionRole.BASE_RESOURCES_READ,
        EmployeePermissionRole.BASE_CALENDAR_BUSINESS_EVENTS_WRITE,
        EmployeePermissionRole.INSPECTION_PROCEDURE_EDIT,
        EmployeePermissionRole.INSPECTION_NOTIFICATIONS_READ,
        EmployeePermissionRole.INSPECTION_OBJECTTYPES_READ,
        EmployeePermissionRole.INSPECTION_CHECKLISTDEFINITIONS_READ);
  }

  @Override
  public String getKeycloakNameWithoutPrefix() {
    return keycloakNameWithoutPrefix;
  }

  @Override
  public List<EmployeePermissionRole> roles() {
    return roles;
  }

  public static ModuleMemberGroup fromValueGracefullyOrNull(String groupName) {
    for (ModuleMemberGroup moduleMemberGroup : ModuleMemberGroup.values()) {
      if (moduleMemberGroup.getKeycloakName().equals(groupName)) {
        return moduleMemberGroup;
      }
    }
    return null;
  }
}
