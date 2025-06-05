/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medsabroad.persistence.database;

/** Note: All enum constants must have corresponding translations in the frontend. */
public enum MedsAbroadSystemProgressEntryType {
  PERSON_DETAILS_UPDATED("Die Angaben zur Person wurden aktualisiert."),
  PROCEDURE_CLOSED("Der Vorgang wurde geschlossen."),
  PROCEDURE_CANCELED("Der Vorgang wurde abgebrochen."),
  PROCEDURE_REOPENED("Der Vorgang wurde wiedereröffnet.");

  private final String changeDescription;

  MedsAbroadSystemProgressEntryType(String changeDescription) {
    this.changeDescription = changeDescription;
  }

  public String getChangeDescription() {
    return changeDescription;
  }
}
