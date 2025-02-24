/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.persistence.db;

/** Note: All enum constants must have corresponding translations in the frontend. */
public enum StiProtectionSystemProgressEntryType {
  PERSON_DETAILS_UPDATED("Die Angaben zur Person wurden aktualisiert."),
  RAPID_TEST_EXAMINATION_UPDATED("Die Schnelltests wurden aktualisiert."),
  LABORATORY_TEST_EXAMINATION_UPDATED("Die Labortests wurden aktualisiert."),
  APPOINTMENT_REBOOKED("Der Termin wurde verschoben auf den %s."),
  APPOINTMENT_CANCELLED("Ein Termin wurde storniert."),
  APPOINTMENT_FINALIZED("Ein Termin wurde als abgeschlossen markiert."),
  MEDICAL_HISTORY_UPDATED("Der Anamnesebogen wurde aktualisiert."),
  CONSULTATION_UPDATED("Die Konsultation wurde aktualisiert."),
  DIAGNOSIS_UPDATED("Die Diagnose wurde aktualisiert."),
  FOLLOW_UP_CREATED("Dieser Folgevorgang wurde aus einem vorherigem Vorgang erstellt.");

  private final String changeDescription;

  StiProtectionSystemProgressEntryType(String changeDescription) {
    this.changeDescription = changeDescription;
  }

  public String getChangeDescription() {
    return changeDescription;
  }
}
