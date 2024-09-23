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
@DiscriminatorValue("CHOROPLETH_MAP")
public class ChoroplethMapConfiguration extends ChartConfiguration {
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
  private Calculation calculation;

  @Column(nullable = false)
  private String geoJson;

  @Column(nullable = false)
  private String colorScheme;

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

  public Calculation getCalculation() {
    return calculation;
  }

  public void setCalculation(Calculation calculation) {
    this.calculation = calculation;
  }

  public String getGeoJson() {
    return geoJson;
  }

  public void setGeoJson(String geoJson) {
    this.geoJson = geoJson;
  }

  public String getColorScheme() {
    return colorScheme;
  }

  public void setColorScheme(String colorScheme) {
    this.colorScheme = colorScheme;
  }
}
