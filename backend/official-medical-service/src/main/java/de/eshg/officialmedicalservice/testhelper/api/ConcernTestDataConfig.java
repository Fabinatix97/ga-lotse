/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.testhelper.api;

public enum ConcernTestDataConfig {
  EXAMINATION_ELIGIBILITY("Prüfungsfähigkeit"),
  CERTIFICATE_FOR_CALL_OF_DUTY("Dienstfähigkeitsbeurteilungen"),
  PRIORITIZATION_OF_CIVIL_SERVANTS("Beamtenpriorisierung"),
  EARLY_RETIREMENT("Vorzeitige Pensionierung"),
  REVIEW_OF_LONGER_SICK_NOTES("Überprüfung längerer Krankschreibungen"),
  ;

  String nameDe;

  ConcernTestDataConfig(String nameDe) {
    this.nameDe = nameDe;
  }

  public String getNameDe() {
    return nameDe;
  }
}
