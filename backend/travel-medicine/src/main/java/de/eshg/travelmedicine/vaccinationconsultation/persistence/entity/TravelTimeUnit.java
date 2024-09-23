/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccinationconsultation.persistence.entity;

public enum TravelTimeUnit {
  DAYS("Tage"),
  WEEKS("Wochen"),
  MONTHS("Monate"),
  YEARS("Jahre");

  final String germanName;

  TravelTimeUnit(String germanName) {
    this.germanName = germanName;
  }

  public String getName() {
    return germanName;
  }
}
