/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.keycloak;

import java.util.List;

public enum CitizenPermissionRole implements PermissionRole {
  STANDARD_CITIZEN(
      "Standardberechtigung Bürger",
      "Standardberechtigung, die ALLE Bürger:innen (inkl. access code user) automatisch erhalten",
      Module.BASE),
  ACCESS_CODE_USER(
      "Benutzer mit Zugangscode",
      "Vorgangsspezifischer Zugriff mit generiertem Code und zweitem Wissensfaktor",
      Module.BASE),
  MUK_USER(
      "Mein Unternehmenskonto Benutzer",
      "Über 'Mein Unternehmenskonto' (externer IDP) authentifizierte Benutzer",
      Module.BASE),
  BUND_ID_USER(
      "BundID Benutzer", "Über 'BundID' (externer IDP) authentifizierte Benutzer", Module.BASE),
  ;

  private final String keycloakNameWithoutPrefix;
  private final String description;
  private final Module module;
  private final List<KeycloakRole> associatedRoles;

  CitizenPermissionRole(
      String keycloakNameWithoutPrefix,
      String description,
      Module module,
      CitizenPermissionRole... associatedRoles) {
    this.keycloakNameWithoutPrefix = keycloakNameWithoutPrefix;
    this.description = description;
    this.module = module;
    this.associatedRoles = List.of(associatedRoles);
  }

  @Override
  public String getKeycloakNameWithoutPrefix() {
    return this.module.getDisplayName() + " - " + this.keycloakNameWithoutPrefix;
  }

  @Override
  public String getDescription() {
    return description;
  }

  @Override
  public List<KeycloakRole> getAssociatedRoles() {
    return this.associatedRoles;
  }

  private enum Module {
    BASE("Grundmodul"),
    SCHOOL_ENTRY("Einschulungsuntersuchungsmodul"),
    INSPECTION("Hygienemodul"),
    TRAVEL_MEDICINE("Impfberatung"),
    MEASLES_PROTECTION("Masernschutzimpfung"),
    CHAT_MANAGEMENT("Chat-Management"),
    STATISTICS("Statistik"),
    MAILROOM("Poststelle"),
    ARCHIVE("Archiv");

    private final String displayName;

    Module(String displayName) {
      this.displayName = displayName;
    }

    String getDisplayName() {
      return displayName;
    }
  }
}
