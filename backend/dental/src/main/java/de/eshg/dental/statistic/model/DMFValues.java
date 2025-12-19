/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.dental.statistic.model;

import java.math.BigDecimal;
import java.math.RoundingMode;

public class DMFValues {
  private int dValue;
  private int mValue;
  private int fValue;

  public DMFValues() {
    this.dValue = 0;
    this.mValue = 0;
    this.fValue = 0;
  }

  public DMFValues(int dValue, int mValue, int fValue) {
    this.dValue = dValue;
    this.mValue = mValue;
    this.fValue = fValue;
  }

  public int getDValue() {
    return dValue;
  }

  public int getMValue() {
    return mValue;
  }

  public int getFValue() {
    return fValue;
  }

  public int getDmftValue() {
    return dValue + fValue + mValue;
  }

  public double getDegreeOfRestoration() {
    int dmftValue = getDmftValue();
    return dmftValue == 0
        ? 0
        : BigDecimal.valueOf(fValue + mValue)
            .divide(BigDecimal.valueOf(dmftValue), 2, RoundingMode.HALF_UP)
            .doubleValue();
  }

  public void increaseDValue() {
    this.dValue++;
  }

  public void increaseMValue() {
    this.mValue++;
  }

  public void increaseFValue() {
    this.fValue++;
  }
}
