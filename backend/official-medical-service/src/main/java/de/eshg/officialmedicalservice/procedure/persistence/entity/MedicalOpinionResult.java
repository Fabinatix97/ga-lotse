/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.procedure.persistence.entity;

public enum MedicalOpinionResult {
  POSITIVE("Positives Ergebnis"),
  NEGATIVE("Negatives Ergebnis"),
  NO_VALUATION("Keine Bewertung"),
  UNKNOWN("Unbekannt"),
  ;

  String germanName;

  MedicalOpinionResult(String germanName) {
    this.germanName = germanName;
  }

  public String getGermanName() {
    return germanName;
  }
}
