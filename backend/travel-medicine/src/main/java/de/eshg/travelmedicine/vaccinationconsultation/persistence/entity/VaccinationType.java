/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccinationconsultation.persistence.entity;

public enum VaccinationType {
  BASIC("Grundimmunisierung"),
  BOOSTER("Auffrischung"),
  ;

  private final String germanName;

  VaccinationType(String germanName) {
    this.germanName = germanName;
  }

  public String getGermanName() {
    return germanName;
  }
}
