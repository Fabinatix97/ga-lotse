/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.persistence.db;

public enum CaseStatus {
  PROCEDURE_VALIDATION("Vorgangsprüfung"),
  PROCEDURE_RECORDED("Vorgang erfasst"),
  LETTER_SEND("Initiales Anschreiben versendet"),
  FOLLOW_UP_LETTER_SEND("Folgeanschreiben versendet"),
  APPOINTMENT_BOOKED("Termin vereinbart"),
  FOLLOW_UP_APPOINTMENT("Folgetermin vereinbart"),
  PROOF_SUBMITTED("Gültiger Nachweis vorgelegt"),
  ATTENDED_NO_PROOF("Termin wahrgenommen, keinen gültigen Nachweis erbracht"),
  REPORT_WITHDRAWN("Meldung von Einrichtung zurückgenommen"),
  PERSON_NOT_ACTIVE("Person nicht mehr in der Einrichtung tätig/betreut"),
  PERSON_TEMP_NOT_ACTIVE("Person längerfristig nicht in der Einrichtung tätig/betreut"),
  MEDICAL_ATTEST("Attest über dauerhafte Kontraindikation vorgelegt"),
  TEMP_MEDICAL_ATTEST("Zeitlich befristetes Attest vorgelegt"),
  AUTHORITY_HANDOVER("Abgabe an das Ordnungsamt"),
  ACCESS_RESTRICTED("Betretungsverbot erteilt"),
  INDIVIDUAL_REVIEW("Individuelle Prüfung");

  private final String displayText;

  CaseStatus(String displayText) {
    this.displayText = displayText;
  }

  public String getDisplayText() {
    return this.displayText;
  }
}
