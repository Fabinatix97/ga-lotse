/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.persistence.entity.chart;

import static de.eshg.lib.common.SensitivityLevel.PUBLIC;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.statistics.persistence.entity.AttributeSelection;
import de.eshg.statistics.persistence.entity.ChartConfiguration;
import jakarta.persistence.CascadeType;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToOne;

@DataSensitivity(PUBLIC)
@Entity
@DiscriminatorValue("PIE_CHART")
public class PieChartConfiguration extends ChartConfiguration {
  @OneToOne(
      cascade = CascadeType.PERSIST,
      fetch = FetchType.LAZY,
      optional = false,
      orphanRemoval = true)
  private AttributeSelection attributeSelection;

  public AttributeSelection getAttributeSelection() {
    return attributeSelection;
  }

  public void setAttributeSelection(AttributeSelection attributeSelection) {
    this.attributeSelection = attributeSelection;
  }
}
