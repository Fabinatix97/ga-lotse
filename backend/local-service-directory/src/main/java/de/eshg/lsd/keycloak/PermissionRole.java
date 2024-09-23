/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lsd.keycloak;

import de.eshg.lib.keycloak.KeycloakRole;
import java.util.List;

/**
 * Representation of permissions to be created in keycloak as roles. These roles are provided by us
 * and remain stable (not edited by admins) opposed to the "DefaultRoles" in the base module.
 */
public enum PermissionRole implements KeycloakRole {
  LSD_WRITE_TECH_USER("write Tech User"),
  LSD_READ_TECH_USER("read Tech User"),

  LSD_ADMIN("Admin", LSD_READ_TECH_USER, LSD_WRITE_TECH_USER),
  ;

  private final String keycloakNameWithoutPrefix;
  private final List<KeycloakRole> associatedRoles;

  PermissionRole(String keycloakNameWithoutPrefix, PermissionRole... associatedRoles) {
    this.keycloakNameWithoutPrefix = keycloakNameWithoutPrefix;
    this.associatedRoles = List.of(associatedRoles);
  }

  @Override
  public String getKeycloakName() {
    return "LSD - " + this.keycloakNameWithoutPrefix;
  }

  @Override
  public String getKeycloakNameWithoutPrefix() {
    return this.keycloakNameWithoutPrefix;
  }

  @Override
  public List<KeycloakRole> getAssociatedRoles() {
    return this.associatedRoles;
  }
}
