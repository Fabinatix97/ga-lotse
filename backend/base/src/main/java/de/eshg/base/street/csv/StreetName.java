/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.street.csv;

public class StreetName {
  private String streetName;
  private boolean unofficial;

  public static StreetName official(String streetName) {
    return new StreetName(streetName, false);
  }

  public static StreetName unofficial(String streetName) {
    return new StreetName(streetName, true);
  }

  public StreetName() {}

  public StreetName(String streetName) {
    this(streetName, false);
  }

  public StreetName(String streetName, boolean unofficial) {
    this.streetName = streetName;
    this.unofficial = unofficial;
  }

  public String getStreetName() {
    return streetName;
  }

  public void setStreetName(String streetName) {
    this.streetName = streetName;
  }

  public boolean isUnofficial() {
    return unofficial;
  }

  public void setUnofficial(boolean unofficial) {
    this.unofficial = unofficial;
  }
}
