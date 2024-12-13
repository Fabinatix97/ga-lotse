/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.persistence.db;

/** Note: All enum constants must have corresponding translations in the frontend. */
public enum StiProtectionSystemProgressEntryType {
  PERSON_DETAILS_UPDATED("Die Angaben zur Person wurden aktualisiert."),
  RAPID_TEST_EXAMINATION_UPDATED("Die Schnelltests wurden aktualisiert."),
  LABORATORY_TEST_EXAMINATION_UPDATED("Die Labortests wurden aktualisiert.");

  private final String changeDescription;

  StiProtectionSystemProgressEntryType(String changeDescription) {
    this.changeDescription = changeDescription;
  }

  public String getChangeDescription() {
    return changeDescription;
  }
}
