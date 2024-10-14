/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.keycloak;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.util.CollectionUtils;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public enum ModuleLeaderGroup implements KeycloakGroup {
  INSPECTION(
      "Begehung",
      ModuleMemberGroup.INSPECTION,
      List.of(ModuleMemberGroup.INSPECTION_CHECKLISTS),
      EmployeePermissionRole.INSPECTION_PROCEDURE_ASSIGN,
      EmployeePermissionRole.INSPECTION_LEADER),
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
      "Medizinalkartei",
      ModuleMemberGroup.MEDICAL_REGISTRY,
      EmployeePermissionRole.MEDICAL_REGISTRY_LEADER);

  private final String keycloakNameWithoutPrefix;
  private final List<EmployeePermissionRole> roles;
  private final List<ModuleMemberGroup> moduleMemberGroups;

  ModuleLeaderGroup(
      String name,
      ModuleMemberGroup moduleMemberGroup,
      List<ModuleMemberGroup> additionalModuleMemberGroups,
      EmployeePermissionRole... roles) {
    this.keycloakNameWithoutPrefix = name + Constants.LEADER_SUFFIX;

    List<EmployeePermissionRole> tempRoles = new ArrayList<>();
    additionalModuleMemberGroups.stream().map(ModuleMemberGroup::roles).forEach(tempRoles::addAll);
    this.roles =
        CollectionUtils.listUnion(List.of(moduleMemberGroup.roles(), tempRoles, List.of(roles)))
            .stream()
            .distinct()
            .toList();
    this.moduleMemberGroups =
        CollectionUtils.listUnion(
            List.of(List.of(moduleMemberGroup), additionalModuleMemberGroups));
  }

  ModuleLeaderGroup(
      String name, ModuleMemberGroup moduleMemberGroup, EmployeePermissionRole... roles) {
    this.keycloakNameWithoutPrefix = name + Constants.LEADER_SUFFIX;
    this.roles = CollectionUtils.listUnion(List.of(moduleMemberGroup.roles(), List.of(roles)));
    this.moduleMemberGroups = List.of(moduleMemberGroup);
  }

  public static ModuleLeaderGroup forModuleMemberGroup(ModuleMemberGroup moduleMemberGroup) {
    return Arrays.stream(values())
        .filter(
            moduleLeaderGroup -> moduleLeaderGroup.moduleMemberGroups.contains(moduleMemberGroup))
        .collect(StreamUtil.toSingleElement());
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
