/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.common;

/**
 * Represents a federal state (Bundesland) or if DE is used the whole country. See <a
 * href="https://www.destatis.de/DE/Methoden/abkuerzung-bundeslaender-DE-EN.html">Länderkürzel</a>
 */
public enum FederalState {
  BW("Baden-Württemberg"),
  BY("Bayern"),
  BE("Berlin"),
  BB("Brandenburg"),
  HB("Bremen"),
  HH("Hamburg"),
  HE("Hessen"),
  MV("Mecklenburg-Vorpommern"),
  NI("Niedersachsen"),
  NW("Nordrhein-Westfalen"),
  RP("Rheinland-Pfalz"),
  SL("Saarland"),
  SN("Sachsen"),
  ST("Sachsen-Anhalt"),
  SH("Schleswig-Holstein"),
  TH("Thüringen"),
  DE("Deutschland");

  private final String fullName;

  FederalState(String fullName) {
    this.fullName = fullName;
  }

  public String getFullName() {
    return fullName;
  }
}
