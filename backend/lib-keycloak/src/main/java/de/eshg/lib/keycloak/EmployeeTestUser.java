/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.keycloak;

import static de.eshg.lib.keycloak.AdministrativeGroup.AUDIT_LOG_ADMIN;
import static de.eshg.lib.keycloak.AdministrativeGroup.WORK_COUNCIL;
import static de.eshg.lib.keycloak.EmployeePermissionRole.BASE_CONTACTS_READ;
import static de.eshg.lib.keycloak.EmployeePermissionRole.CHAT_MANAGEMENT_WRITE;

import de.eshg.base.util.CollectionUtils;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public enum EmployeeTestUser implements KeycloakUser {
  DUMMY(
      "dummy",
      "+49 555 123 100",
      "password",
      "Max",
      "Mustermann",
      List.of(EmployeePermissionRole.values()),
      CollectionUtils.arrayUnion(
          List.of(
              TechnicalGroup.values(),
              ModuleLeaderGroup.values(),
              ModuleMemberGroup.values(),
              AdministrativeGroup.values()))),
  BASE_MODULE_GDPR_USER(
      "base_dummy",
      "+49 555 123 420",
      "password",
      "Max",
      "Mustermann",
      List.of(
          EmployeePermissionRole.STANDARD_EMPLOYEE,
          EmployeePermissionRole.BASE_GDPR_PROCEDURE_WRITE),
      List.of()),
  KEYCLOAK_USER_ADMINISTRATOR_DUMMY(
      "keycloak_system_admin",
      "+49 555 123 463",
      "password",
      "Max",
      "Müller",
      List.of(AdministrativeGroup.USER_ADMINISTRATOR)),
  AUDIT_LOG_ADMIN_DUMMY(
      "audit_log_admin_dummy",
      "+46 555 123 455",
      "password",
      "Marie",
      "Mustermann",
      List.of(AUDIT_LOG_ADMIN)),
  WORK_COUNCIL_DUMMY(
      "work_council_dummy", "+46 555 123 465", "password", "Jack", "Bauer", List.of(WORK_COUNCIL)),
  TM_DUMMY(
      "tm_user",
      "+46 555 123 456",
      "password",
      "Anna",
      "Schmidt",
      List.of(ModuleMemberGroup.TRAVEL_MEDICINE)),
  TM_MODULE_LEADER(
      "tm_lead",
      "+46 555 123 455",
      "password",
      "Lukas",
      "Bauer",
      List.of(ModuleMemberGroup.TRAVEL_MEDICINE, ModuleLeaderGroup.TRAVEL_MEDICINE)),
  SCHOOL_ENTRY_DUMMY(
      "school_entry_dummy_user",
      "+49 555 123 457",
      "password",
      "Marie",
      "Fischer",
      List.of(ModuleMemberGroup.SCHOOL_ENTRY)),
  SCHOOL_ENTRY_MODULE_LEADER(
      "school_entry_module_leader",
      "+49 555 123 460",
      "password",
      "Leon",
      "Weber",
      List.of(ModuleMemberGroup.SCHOOL_ENTRY, ModuleLeaderGroup.SCHOOL_ENTRY)),
  INSPECTION_GA_USER(
      "inspection_ga_user",
      "+49 555 123 458",
      "password",
      "Sophie",
      "Wagner",
      List.of(ModuleMemberGroup.INSPECTION)),
  INSPECTION_GA_CONFIG(
      "inspection_ga_config",
      "+49 555 123 459 2",
      "password",
      "Paul",
      "Becker",
      List.of(ModuleMemberGroup.INSPECTION_CHECKLISTS, ModuleMemberGroup.INSPECTION)),
  INSPECTION_GA_TEAMLEAD(
      "inspection_ga_teamlead",
      "+49 555 123 459",
      "password",
      "Emilia",
      "Hoffmann",
      List.of(
          ModuleLeaderGroup.INSPECTION,
          ModuleMemberGroup.INSPECTION,
          ModuleMemberGroup.INSPECTION_CHECKLISTS)),
  INSPECTION_GA_IMPORT(
      "inspection_ga_import",
      "+49 555 123 459 3",
      "password",
      "Max",
      "Import",
      List.of(EmployeePermissionRole.INSPECTION_IMPORT),
      List.of(ModuleMemberGroup.INSPECTION)),
  INSPECTION_LANDESAMT_USER(
      "inspection_la_user",
      "+49 555 123 460",
      "password",
      "Jonas",
      "Mayer",
      List.of(ModuleMemberGroup.INSPECTION_LANDESAMT)),
  INSPECTION_LANDESAMT_LEADER(
      "inspection_la_leader",
      "+49 555 123 460",
      "password",
      "Hans",
      "Voigt",
      List.of(ModuleMemberGroup.INSPECTION_LANDESAMT, ModuleLeaderGroup.INSPECTION_LANDESAMT)),
  MEASLES_PROTECTION_MODULE_DUMMY(
      "measles_protection_dummy_user",
      "+49 555 123 461",
      "password",
      "Laura",
      "Schulz",
      List.of(ModuleMemberGroup.MEASLES_PROTECTION)),
  MEASLES_PROTECTION_MODULE_LEADER(
      "measles_protection_module_leader",
      "+49 555 123 462",
      "password",
      "Felix",
      "Richter",
      List.of(ModuleMemberGroup.MEASLES_PROTECTION, ModuleLeaderGroup.MEASLES_PROTECTION)),
  STATISTICS_MODULE_DUMMY(
      "statistics_module_dummy_user",
      "+49 555 123 463",
      "password",
      "Martin",
      "Köhler",
      List.of(ModuleMemberGroup.STATISTICS)),
  STATISTICS_MODULE_LEADER(
      "statistics_module_leader",
      "+49 555 123 464",
      "password",
      "Philipp",
      "Küster",
      List.of(ModuleMemberGroup.STATISTICS, ModuleLeaderGroup.STATISTICS)),
  CHAT_USER_1(
      "chat_user1",
      "+49 555 123 463",
      "password",
      "Thomas",
      "Anderson",
      List.of(BASE_CONTACTS_READ, CHAT_MANAGEMENT_WRITE),
      List.of()),
  CHAT_USER_2(
      "chat_user2",
      "+49 555 123 468",
      "password",
      "Lorenz",
      "Fischborn",
      List.of(BASE_CONTACTS_READ, CHAT_MANAGEMENT_WRITE),
      List.of()),
  CHAT_USER_3(
      "chat_user3",
      "+49 555 123 469",
      "password",
      "Karin-Anne",
      "Moß",
      List.of(BASE_CONTACTS_READ, CHAT_MANAGEMENT_WRITE),
      List.of()),
  ALL_ROLES_NO_GROUPS(
      "all_roles_no_groups",
      "+49 555 123 464",
      "password",
      "Norbert",
      "Krupp",
      List.of(EmployeePermissionRole.values()),
      CollectionUtils.arrayUnion(List.of())),
  MEDICAL_REGISTRY_DUMMY(
      "medical_registry_dummy_user",
      "+49 555 123 466",
      "password",
      "Marco",
      "Adamec",
      List.of(ModuleMemberGroup.MEDICAL_REGISTRY)),
  MEDICAL_REGISTRY_MODULE_LEADER(
      "medical_registry_module_leader",
      "+49 555 123 467",
      "password",
      "Jürgen",
      "Klinsmann",
      List.of(ModuleMemberGroup.MEDICAL_REGISTRY, ModuleLeaderGroup.MEDICAL_REGISTRY)),
  OPEN_DATA_DUMMY(
      "open_data_dummy_user",
      "+49 555 123 470",
      "password",
      "Daniel",
      "Schultze",
      List.of(ModuleMemberGroup.OPEN_DATA)),
  OMS_LEADER(
      "oms_leader",
      "+49 555 456 654",
      "password",
      "Paula",
      "Paulsen",
      List.of(
          ModuleLeaderGroup.OFFICIAL_MEDICAL_SERVICE, ModuleMemberGroup.OFFICIAL_MEDICAL_SERVICE)),
  OMS_CLERK(
      "oms_clerk",
      "+49 555 456 456",
      "password",
      "Hans",
      "Hansen",
      List.of(ModuleMemberGroup.OFFICIAL_MEDICAL_SERVICE)),
  DENTAL_MODULE_LEADER(
      "dental_module_leader",
      "+49 555 456 456",
      "password",
      "Thomas",
      "Müller",
      List.of(ModuleMemberGroup.DENTAL, ModuleLeaderGroup.DENTAL)),
  STI_PROTECTION_DUMMY(
      "sti_protection_dummy_user",
      "+49 555 123 470",
      "password",
      "Klaus",
      "Klausen",
      List.of(ModuleMemberGroup.STI_PROTECTION)),
  STI_PROTECTION_MODULE_LEADER(
      "sti_protection_module_leader",
      "+49 555 123 471",
      "password",
      "Max",
      "Power",
      List.of(ModuleMemberGroup.STI_PROTECTION, ModuleLeaderGroup.STI_PROTECTION));

  private final String username;
  private final String email;
  private final String phoneNumber;
  private final String password;
  private final String firstName;
  private final String lastName;
  private final List<KeycloakRole> roles;

  private final List<KeycloakGroup> groups;

  EmployeeTestUser(
      String username,
      String phoneNumber,
      String password,
      String firstName,
      String lastName,
      List<EmployeePermissionRole> roles,
      List<KeycloakGroup> groups) {
    this.username = username;
    this.email = username + TEST_USER_EMAIL_POSTFIX;
    this.phoneNumber = phoneNumber;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.roles = new ArrayList<>(roles);
    this.groups = groups;
  }

  EmployeeTestUser(
      String username,
      String phoneNumber,
      String password,
      String firstName,
      String lastName,
      List<KeycloakGroup> groups) {
    this(username, phoneNumber, password, firstName, lastName, List.of(), groups);
  }

  @Override
  public String username() {
    return username;
  }

  @Override
  public String email() {
    return email;
  }

  @Override
  public String phoneNumber() {
    return phoneNumber;
  }

  @Override
  public String externalChatUsername() {
    return username;
  }

  @Override
  public String password() {
    return password;
  }

  public UsernamePassword getUsernamePassword() {
    return new UsernamePassword(username, password);
  }

  @Override
  public String firstName() {
    return firstName;
  }

  @Override
  public String lastName() {
    return lastName;
  }

  @Override
  public List<KeycloakRole> roles() {
    return roles;
  }

  @Override
  public List<KeycloakGroup> groups() {
    return groups;
  }

  @Override
  public Map<String, String> additionalAttributes() {
    return Map.of();
  }
}
