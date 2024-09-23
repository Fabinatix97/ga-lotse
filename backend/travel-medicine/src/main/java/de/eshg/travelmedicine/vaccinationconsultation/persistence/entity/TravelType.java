/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccinationconsultation.persistence.entity;

public enum TravelType {
  UNSPECIFIED("Nicht spezifiziert"),
  NO_TRAVEL("Keine Reise"),
  BUSINESS("Geschäftsreise"),
  VACATION("Urlaubsreise"),
  BACKPACK("Rucksackreise");

  final String germanName;

  TravelType(String germanName) {
    this.germanName = germanName;
  }

  public String getName() {
    return germanName;
  }
}
