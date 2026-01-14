/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.keycloak;

import static de.eshg.lib.keycloak.KeycloakRole.ADMIN_KEYCLOAK_NAME;

import java.util.List;

public enum AdministrativeGroup implements KeycloakGroup {
  USER_ADMINISTRATOR(
      "Benutzeradministrator",
      EmployeePermissionRole.BASE_CONTACTS_WRITE,
      EmployeePermissionRole.CHAT_USER),
  RESOURCE_ADMIN(
      "Verwalter Ressourcen",
      EmployeePermissionRole.BASE_CONTACTS_WRITE,
      EmployeePermissionRole.CHAT_USER,
      EmployeePermissionRole.BASE_RESOURCES_READ,
      EmployeePermissionRole.BASE_RESOURCES_WRITE,
      EmployeePermissionRole.BASE_LABELS_WRITE),
  INVENTORY_ADMIN(
      "Verwalter Inventar",
      EmployeePermissionRole.BASE_CONTACTS_WRITE,
      EmployeePermissionRole.CHAT_USER,
      EmployeePermissionRole.BASE_INVENTORY_READ,
      EmployeePermissionRole.BASE_INVENTORY_ADMINISTRATE,
      EmployeePermissionRole.BASE_LABELS_WRITE),

  AUDIT_LOG_ADMIN(
      ADMIN_KEYCLOAK_NAME.formatted("Auditlog"), EmployeePermissionRole.AUDITLOG_AUTHORIZE_ACCESS),
  WORK_COUNCIL("Betriebsrat", EmployeePermissionRole.AUDITLOG_DECRYPT_AND_ACCESS);

  private final String keycloakNameWithoutPrefix;
  private final List<EmployeePermissionRole> roles;

  AdministrativeGroup(String keycloakName, EmployeePermissionRole... roles) {
    this.keycloakNameWithoutPrefix = keycloakName;
    this.roles = List.of(roles);
  }

  @Override
  public String getKeycloakNameWithoutPrefix() {
    return keycloakNameWithoutPrefix;
  }

  @Override
  public List<EmployeePermissionRole> roles() {
    return roles;
  }
}
