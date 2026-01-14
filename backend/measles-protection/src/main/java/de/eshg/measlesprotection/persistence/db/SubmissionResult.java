/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.persistence.db;

/** The SubmissionResult describes the current state and the final outcome of a proof submission. */
public enum SubmissionResult {
  UNDER_REVIEW("Nachweis in Prüfung"),
  ATTENDED_NO_PROOF("Termin wahrgenommen, keinen gültigen Nachweis erbracht"),
  TEMP_MEDICAL_ATTEST("Zeitlich befristetes Attest vorgelegt"),
  MEDICAL_ATTEST("Attest über dauerhafte Kontraindikation vorgelegt"),
  PROOF_SUBMITTED("Gültiger Nachweis vorgelegt");

  private final String displayText;

  SubmissionResult(String displayText) {
    this.displayText = displayText;
  }

  public String getDisplayText() {
    return displayText;
  }
}
