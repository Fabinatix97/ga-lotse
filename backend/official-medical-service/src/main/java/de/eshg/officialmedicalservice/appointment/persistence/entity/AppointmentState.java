/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.appointment.persistence.entity;

public enum AppointmentState {
  OPEN("OFFEN"),
  CLOSED("GESCHLOSSEN"),
  ;

  private final String germanName;

  AppointmentState(String germanName) {
    this.germanName = germanName;
  }

  public String getGermanName() {
    return germanName;
  }
}
