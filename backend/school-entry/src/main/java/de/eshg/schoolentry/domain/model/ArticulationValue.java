/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.domain.model;

public enum ArticulationValue {
  INCONSPICUOUS(0),
  CONSPICUOUS(1),
  UNKNOWN(9);

  private final int weight;

  ArticulationValue(int weight) {
    this.weight = weight;
  }

  public int getWeight() {
    return weight;
  }
}
