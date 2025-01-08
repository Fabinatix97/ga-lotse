/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.persistence.entity.filter;

import static de.eshg.lib.common.SensitivityLevel.PUBLIC;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.statistics.persistence.entity.AbstractFilterParameter;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@DataSensitivity(PUBLIC)
@Entity
@DiscriminatorValue("BOOLEAN_FILTER")
public class BooleanFilterParameter extends AbstractFilterParameter {

  @Column(nullable = false)
  private boolean searchForTrue;

  @Column(nullable = false)
  private boolean searchForFalse;

  @Column(nullable = false)
  private boolean searchForNull;

  public boolean isSearchForTrue() {
    return searchForTrue;
  }

  public void setSearchForTrue(boolean searchForTrue) {
    this.searchForTrue = searchForTrue;
  }

  public boolean isSearchForFalse() {
    return searchForFalse;
  }

  public void setSearchForFalse(boolean searchForFalse) {
    this.searchForFalse = searchForFalse;
  }

  public boolean isSearchForNull() {
    return searchForNull;
  }

  public void setSearchForNull(boolean searchForNull) {
    this.searchForNull = searchForNull;
  }
}
