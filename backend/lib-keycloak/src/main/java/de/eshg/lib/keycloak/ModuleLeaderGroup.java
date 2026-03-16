/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.keycloak;

import de.eshg.base.util.CollectionUtils;
import java.util.Collection;
import java.util.List;

public enum ModuleLeaderGroup implements KeycloakGroup {
  INSPECTION(
      "Begehung",
      List.of(ModuleMemberGroup.INSPECTION, ModuleMemberGroup.INSPECTION_CHECKLISTS),
      EmployeePermissionRole.INSPECTION_PROCEDURE_ASSIGN,
      EmployeePermissionRole.INSPECTION_LEADER,
      EmployeePermissionRole.INSPECTION_IMPORT),
  INSPECTION_LANDESAMT(
      "Begehung Landesamt",
      ModuleMemberGroup.INSPECTION_LANDESAMT,
      EmployeePermissionRole.INSPECTION_LANDESAMT_LEADER),
  SCHOOL_ENTRY(
      "Einschulungsuntersuchung",
      ModuleMemberGroup.SCHOOL_ENTRY,
      EmployeePermissionRole.SCHOOL_ENTRY_LEADER),
  TRAVEL_MEDICINE(
      "Impfberatung",
      ModuleMemberGroup.TRAVEL_MEDICINE,
      EmployeePermissionRole.TRAVEL_MEDICINE_LEADER),
  MEASLES_PROTECTION(
      "Masernschutz",
      ModuleMemberGroup.MEASLES_PROTECTION,
      EmployeePermissionRole.MEASLES_PROTECTION_LEADER),
  STATISTICS(
      "Statistik",
      ModuleMemberGroup.STATISTICS,
      EmployeePermissionRole.STATISTICS_STATISTICS_ADMIN,
      EmployeePermissionRole.STATISTICS_LEADER),
  STI_PROTECTION(
      "HIV-STI-Schutz",
      ModuleMemberGroup.STI_PROTECTION,
      EmployeePermissionRole.STI_PROTECTION_LEADER),
  MEDICAL_REGISTRY(
      "Medizinalaufsicht",
      ModuleMemberGroup.MEDICAL_REGISTRY,
      EmployeePermissionRole.MEDICAL_REGISTRY_LEADER),
  DENTAL("Zahnärztlicher Dienst", ModuleMemberGroup.DENTAL, EmployeePermissionRole.DENTAL_LEADER),
  OPEN_DATA("Open Data", ModuleMemberGroup.OPEN_DATA, EmployeePermissionRole.OPEN_DATA_LEADER),
  OFFICIAL_MEDICAL_SERVICE(
      "Amtsärztlicher Dienst",
      ModuleMemberGroup.OFFICIAL_MEDICAL_SERVICE,
      EmployeePermissionRole.OFFICIAL_MEDICAL_SERVICE_LEADER,
      EmployeePermissionRole.OFFICIAL_MEDICAL_SERVICE_ASSESSMENT_EDITOR_EDIT,
      EmployeePermissionRole.OFFICIAL_MEDICAL_SERVICE_ASSESSMENT_PREVIEW_READER_EDIT,
      EmployeePermissionRole.OFFICIAL_MEDICAL_SERVICE_LEGAL_NOTES_WRITE),
  MEDS_ABROAD(
      "Reisen mit Betäubungsmitteln",
      ModuleMemberGroup.MEDS_ABROAD,
      EmployeePermissionRole.MEDS_ABROAD_LEADER),
  PROSTITUTE_PROTECTION(
      "Prostituiertenschutzgesetz",
      ModuleMemberGroup.PROSTITUTE_PROTECTION,
      EmployeePermissionRole.PROSTITUTE_PROTECTION_LEADER),
  INFECTION_BRIEFING(
      "Belehrung nach Infektionsschutzgesetz",
      ModuleMemberGroup.INFECTION_BRIEFING,
      EmployeePermissionRole.INFECTION_BRIEFING_LEADER);

  private final String keycloakNameWithoutPrefix;
  private final List<EmployeePermissionRole> roles;

  ModuleLeaderGroup(
      String name, List<ModuleMemberGroup> moduleMemberGroup, EmployeePermissionRole... roles) {
    this.keycloakNameWithoutPrefix = name + Constants.LEADER_SUFFIX;

    List<EmployeePermissionRole> moduleMemberRoles =
        moduleMemberGroup.stream()
            .map(ModuleMemberGroup::roles)
            .flatMap(Collection::stream)
            .toList();

    this.roles =
        CollectionUtils.listUnion(List.of(moduleMemberRoles, List.of(roles))).stream()
            .distinct()
            .toList();
  }

  ModuleLeaderGroup(
      String name, ModuleMemberGroup moduleMemberGroup, EmployeePermissionRole... roles) {
    this(name, List.of(moduleMemberGroup), roles);
  }

  public static ModuleLeaderGroup forModuleMemberGroup(ModuleMemberGroup moduleMemberGroup) {
    return switch (moduleMemberGroup) {
      case INSPECTION, INSPECTION_CHECKLISTS -> ModuleLeaderGroup.INSPECTION;
      case INSPECTION_LANDESAMT -> ModuleLeaderGroup.INSPECTION_LANDESAMT;
      case SCHOOL_ENTRY -> ModuleLeaderGroup.SCHOOL_ENTRY;
      case TRAVEL_MEDICINE -> ModuleLeaderGroup.TRAVEL_MEDICINE;
      case MEASLES_PROTECTION -> ModuleLeaderGroup.MEASLES_PROTECTION;
      case STATISTICS -> ModuleLeaderGroup.STATISTICS;
      case STI_PROTECTION -> ModuleLeaderGroup.STI_PROTECTION;
      case MEDICAL_REGISTRY -> ModuleLeaderGroup.MEDICAL_REGISTRY;
      case DENTAL -> ModuleLeaderGroup.DENTAL;
      case OPEN_DATA -> ModuleLeaderGroup.OPEN_DATA;
      case OFFICIAL_MEDICAL_SERVICE -> ModuleLeaderGroup.OFFICIAL_MEDICAL_SERVICE;
      case MEDS_ABROAD -> ModuleLeaderGroup.MEDS_ABROAD;
      case PROSTITUTE_PROTECTION -> ModuleLeaderGroup.PROSTITUTE_PROTECTION;
      case INFECTION_BRIEFING -> ModuleLeaderGroup.INFECTION_BRIEFING;
    };
  }

  @Override
  public String getKeycloakNameWithoutPrefix() {
    return keycloakNameWithoutPrefix;
  }

  @Override
  public List<EmployeePermissionRole> roles() {
    return roles;
  }

  private static class Constants {

    public static final String LEADER_SUFFIX = " Leitung";
  }
}
