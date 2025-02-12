/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
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
