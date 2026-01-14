/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.keycloak;

import de.eshg.lib.keycloak.*;
import de.eshg.testhelper.environment.EnvironmentConfig;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Stream;
import org.springframework.context.annotation.DependsOn;
import org.springframework.stereotype.Component;

/**
 * Extension of KeycloakProvisioning for test-only resources (e.g. TestUsers) that must not be
 * created in production
 */
@Component
@DependsOn(EmployeeKeycloakProvisioning.BEAN_NAME)
@ConditionalOnTestUserProvisioningEnabled
public class EmployeeKeycloakTestProvisioning extends KeycloakTestProvisioning {

  public EmployeeKeycloakTestProvisioning(
      EmployeeKeycloakTestClient employeeKeycloakTestClient,
      KeycloakProperties keycloakProperties,
      EnvironmentConfig environmentConfig) {
    super(employeeKeycloakTestClient, keycloakProperties, environmentConfig);
  }

  @Override
  void provisionTestResources() {
    super.provisionTestResources();
    addUsersToGroups();
  }

  private void addUsersToGroups() {
    keycloakTestClient.addUsersToGroups(List.of(EmployeeTestUser.values()));
    keycloakTestClient.addUsersToGroups(getSystemAdministratorGroupUsers());
    keycloakTestClient.addUsersToGroups(getTechnicalGroupUsers());
  }

  @Override
  protected List<KeycloakUser> getAllKeycloakUsersToProvision() {
    List<KeycloakUser> allUsers = new ArrayList<>();
    allUsers.addAll(List.of(EmployeeTestUser.values()));
    allUsers.addAll(getPermissionRoleUsers(EmployeePermissionRole.values()));
    allUsers.addAll(getSystemAdministratorGroupUsers());
    allUsers.addAll(getTechnicalGroupUsers());
    return allUsers;
  }

  private String mapSystemAdminGroupToFirstName(AdministrativeGroup group) {
    return switch (group) {
      case USER_ADMINISTRATOR -> "Johannes";
      case RESOURCE_ADMIN -> "Karl";
      case INVENTORY_ADMIN -> "Lukas";
      case AUDIT_LOG_ADMIN -> "Tom";
      case WORK_COUNCIL -> "Kim";
    };
  }

  private String mapSystemAdminGroupToLastName(AdministrativeGroup group) {
    return switch (group) {
      case USER_ADMINISTRATOR -> "Schumacher";
      case RESOURCE_ADMIN -> "Meier";
      case INVENTORY_ADMIN -> "Hoffmann";
      case AUDIT_LOG_ADMIN -> "Kirkman";
      case WORK_COUNCIL -> "Bauer";
    };
  }

  private List<KeycloakUser> getSystemAdministratorGroupUsers() {
    return Stream.of(AdministrativeGroup.values())
        .map(
            group ->
                toKeycloakUser(
                    group,
                    this::mapSystemAdminGroupToFirstName,
                    this::mapSystemAdminGroupToLastName))
        .toList();
  }

  private String mapTechnicalGroupToFirstName(TechnicalGroup group) {
    return switch (group) {
      case SCHOOL_ENTRY_MFA -> "Leon";
      case DENTIST -> "Max";
      case ZFA -> "Markus";
      case SCHOOL_ENTRY_PHYSICIAN -> "Aaron";
      case TRAVEL_MEDICINE_MFA -> "Laura";
      case TRAVEL_MEDICINE_PHYSICIAN -> "Kai";
      case STI_PROTECTION_PHYSICIAN -> "Michael";
      case STI_PROTECTION_MFA -> "Emilia";
      case STI_PROTECTION_CONSULTANT -> "Gregor";
      case OFFICIAL_MEDICAL_SERVICE_PHYSICIANS -> "Tina";
      case MEDS_ABROAD_MFA -> "Louise";
      case PROSTITUTE_PROTECTION_CONSULTANT -> "Sigmund";
      case SCHOOL_ENTRY_SOPASS -> "Oztafan";
    };
  }

  private String mapTechnicalGroupToLastName(TechnicalGroup group) {
    return switch (group) {
      case SCHOOL_ENTRY_MFA -> "Hermann";
      case DENTIST -> "Schuster";
      case ZFA -> "Scholl";
      case SCHOOL_ENTRY_PHYSICIAN -> "Müller";
      case TRAVEL_MEDICINE_MFA -> "Schmitt";
      case TRAVEL_MEDICINE_PHYSICIAN -> "Schulz";
      case STI_PROTECTION_PHYSICIAN -> "Kohlhaas";
      case STI_PROTECTION_MFA -> "Galotti";
      case STI_PROTECTION_CONSULTANT -> "Samsa";
      case OFFICIAL_MEDICAL_SERVICE_PHYSICIANS -> "Hoffmann";
      case MEDS_ABROAD_MFA -> "Belcher";
      case PROSTITUTE_PROTECTION_CONSULTANT -> "Freud";
      case SCHOOL_ENTRY_SOPASS -> "Kolibril";
    };
  }

  private List<KeycloakUser> getTechnicalGroupUsers() {
    return Stream.of(TechnicalGroup.values())
        .map(
            group ->
                toKeycloakUser(
                    group,
                    this::mapTechnicalGroupToFirstName,
                    this::mapTechnicalGroupToLastName,
                    EmployeePermissionRole.BASE_CONTACTS_READ))
        .toList();
  }

  private <T extends Enum<? extends KeycloakGroup> & KeycloakGroup> KeycloakUser toKeycloakUser(
      T group,
      Function<T, String> firstNameMapper,
      Function<T, String> lastNameMapper,
      EmployeePermissionRole... employeePermissionRole) {
    String groupName = group.name().toLowerCase(Locale.ROOT);
    return new KeycloakTestUser(
        groupName,
        null,
        null,
        firstNameMapper.apply(group),
        lastNameMapper.apply(group),
        "password",
        Arrays.asList(employeePermissionRole),
        List.of(group),
        Map.of());
  }
}
