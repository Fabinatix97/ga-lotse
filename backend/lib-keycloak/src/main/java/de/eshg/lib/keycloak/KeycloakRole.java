/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.keycloak;

import java.util.List;

public interface KeycloakRole {
  String SYSTEM_PREFIX = "[System] ";
  String CLAIM_NAME = "roles";
  String AUTHORITY_PREFIX = "ROLE_";
  String LEADER_KEYCLOAK_NAME = "Fachbereichsleitung";
  String LEADER_DESCRIPTION =
      "Der Hauptverantwortliche für den Fachbereich %s. Kann neue Benutzer für den Fachbereich inkl. relevanter Rollen vorschlagen.";
  String ADMIN_KEYCLOAK_NAME = "%s Admin";

  String READ_PERMISSION_TEMPLATE = "Leseberechtigung %s";
  String WRITE_PERMISSION_TEMPLATE = "Schreibberechtigung %s";
  String DELETE_PERMISSION_TEMPLATE = "Löschberechtigung %s";
  String READ_AND_WRITE_PERMISSION_TEMPLATE = "Lese- und Schreibberechtigung %s";
  String READ_AND_DELETE_PERMISSION_TEMPLATE = "Lese- und Löschberechtigung %s";

  default String getKeycloakName() {
    return SYSTEM_PREFIX + getKeycloakNameWithoutPrefix();
  }

  String getKeycloakNameWithoutPrefix();

  default String getDescription() {
    return null;
  }

  List<KeycloakRole> getAssociatedRoles();
}
