/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.persistence.db;

public enum ReportingReason {
  NO_PROOF("ohne Nachweis"),
  FIRST_VACCINE("nur 1. Impfung"),
  MEDICAL_CONTRAINDICATION("med. Kontraindikation / Attest"),
  UNASSESSABLE_PROOF("Nachweis nicht beurteilbar (z.B. unleserlich, Fremdsprache)"),
  OTHER("anderer Grund"),
  ;

  String germanName;

  ReportingReason(String germanName) {
    this.germanName = germanName;
  }

  public String getGermanName() {
    return germanName;
  }
}
