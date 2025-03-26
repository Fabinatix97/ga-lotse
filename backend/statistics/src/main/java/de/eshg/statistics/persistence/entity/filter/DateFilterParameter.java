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
@DiscriminatorValue("DATE_FILTER")
public class DateFilterParameter extends AbstractFilterParameter {

  @Column(nullable = false)
  private String value;

  public String getValue() {
    return value;
  }

  public void setValue(String value) {
    this.value = value;
  }
}
