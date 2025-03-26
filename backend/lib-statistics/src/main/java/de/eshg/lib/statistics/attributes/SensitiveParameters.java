/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.statistics.attributes;

public class SensitiveParameters {
  private final Integer lDiversity;
  private final Double tCloseness;

  public SensitiveParameters(Integer lDiversity, Double tCloseness) {
    if (lDiversity == null && tCloseness == null) {
      throw new IllegalArgumentException("Either lDiversity or tCloseness should be provided");
    }
    this.lDiversity = lDiversity;
    this.tCloseness = tCloseness;
  }

  public Integer getLDiversity() {
    return lDiversity;
  }

  public Double getTCloseness() {
    return tCloseness;
  }
}
