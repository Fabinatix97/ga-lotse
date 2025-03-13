/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
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
