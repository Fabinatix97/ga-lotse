/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.procedure.persistence.entity;

public enum MedicalOpinionStatus {
  IN_PROGRESS("In Arbeit"),
  ACCOMPLISHED("Fertig"),
  ;

  String germanName;

  MedicalOpinionStatus(String germanName) {
    this.germanName = germanName;
  }

  public String getGermanName() {
    return germanName;
  }
}
