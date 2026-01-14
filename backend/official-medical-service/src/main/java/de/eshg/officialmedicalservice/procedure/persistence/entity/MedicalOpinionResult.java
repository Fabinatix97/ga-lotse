/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
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
