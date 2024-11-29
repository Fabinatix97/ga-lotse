/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.persistence.entity.chart;

import static de.eshg.lib.common.SensitivityLevel.PUBLIC;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.statistics.persistence.entity.AttributeSelection;
import de.eshg.statistics.persistence.entity.ChartConfiguration;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToOne;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@DataSensitivity(PUBLIC)
@Entity
@DiscriminatorValue("LINE_CHART")
public class LineChartConfiguration extends ChartConfiguration
    implements PointBasedChartConfiguration {
  @OneToOne(
      cascade = CascadeType.PERSIST,
      fetch = FetchType.LAZY,
      optional = false,
      orphanRemoval = true)
  private AttributeSelection xAttributeSelection;

  @OneToOne(
      cascade = CascadeType.PERSIST,
      fetch = FetchType.LAZY,
      optional = false,
      orphanRemoval = true)
  private AttributeSelection yAttributeSelection;

  @OneToOne(cascade = CascadeType.PERSIST, fetch = FetchType.LAZY, orphanRemoval = true)
  private AttributeSelection secondaryAttributeSelection;

  @Column(nullable = false)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  private Range range;

  @Override
  public AttributeSelection getXAttributeSelection() {
    return xAttributeSelection;
  }

  public void setXAttributeSelection(AttributeSelection xAttributeSelection) {
    this.xAttributeSelection = xAttributeSelection;
  }

  @Override
  public AttributeSelection getYAttributeSelection() {
    return yAttributeSelection;
  }

  public void setYAttributeSelection(AttributeSelection yAttributeSelection) {
    this.yAttributeSelection = yAttributeSelection;
  }

  @Override
  public AttributeSelection getSecondaryAttributeSelection() {
    return secondaryAttributeSelection;
  }

  public void setSecondaryAttributeSelection(AttributeSelection secondaryAttributeSelection) {
    this.secondaryAttributeSelection = secondaryAttributeSelection;
  }

  public Range getRange() {
    return range;
  }

  public void setRange(Range range) {
    this.range = range;
  }
}
