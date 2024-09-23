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
@DiscriminatorValue("BAR_CHART")
public class BarChartConfiguration extends ChartConfiguration {
  @OneToOne(
      cascade = CascadeType.PERSIST,
      fetch = FetchType.LAZY,
      optional = false,
      orphanRemoval = true)
  private AttributeSelection primaryAttributeSelection;

  @OneToOne(cascade = CascadeType.PERSIST, fetch = FetchType.LAZY, orphanRemoval = true)
  private AttributeSelection secondaryAttributeSelection;

  @Column
  @JdbcType(PostgreSQLEnumJdbcType.class)
  private Scaling scaling;

  @Column
  @JdbcType(PostgreSQLEnumJdbcType.class)
  private GroupingType grouping;

  @Column(nullable = false)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  private Orientation orientation;

  public AttributeSelection getPrimaryAttributeSelection() {
    return primaryAttributeSelection;
  }

  public void setPrimaryAttributeSelection(AttributeSelection primaryAttributeSelection) {
    this.primaryAttributeSelection = primaryAttributeSelection;
  }

  public AttributeSelection getSecondaryAttributeSelection() {
    return secondaryAttributeSelection;
  }

  public void setSecondaryAttributeSelection(AttributeSelection secondaryAttributeSelection) {
    this.secondaryAttributeSelection = secondaryAttributeSelection;
  }

  public Scaling getScaling() {
    return scaling;
  }

  public void setScaling(Scaling scaling) {
    this.scaling = scaling;
  }

  public GroupingType getGrouping() {
    return grouping;
  }

  public void setGrouping(GroupingType grouping) {
    this.grouping = grouping;
  }

  public Orientation getOrientation() {
    return orientation;
  }

  public void setOrientation(Orientation orientation) {
    this.orientation = orientation;
  }
}
