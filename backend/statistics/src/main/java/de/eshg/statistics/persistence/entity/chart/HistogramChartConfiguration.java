/*
 * Copyright 2025 cronn GmbH
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
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.OrderColumn;
import jakarta.validation.constraints.Min;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@DataSensitivity(PUBLIC)
@Entity
@DiscriminatorValue("HISTOGRAM_CHART")
public class HistogramChartConfiguration extends ChartConfiguration
    implements TwoAttributesChartConfiguration {
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

  @Column
  @JdbcType(PostgreSQLEnumJdbcType.class)
  private BinningMode binningMode;

  @Min(1)
  @Column
  private Integer numberOfBins;

  @Column(precision = 10, scale = 4)
  private BigDecimal minBin;

  @Column(precision = 10, scale = 4)
  private BigDecimal maxBin;

  @OneToMany(
      cascade = CascadeType.PERSIST,
      fetch = FetchType.LAZY,
      mappedBy = HistogramBin_.HISTOGRAM_CHART_CONFIGURATION,
      orphanRemoval = true)
  @OrderColumn
  private final List<HistogramBin> bins = new ArrayList<>();

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

  public BinningMode getBinningMode() {
    return binningMode;
  }

  public void setBinningMode(BinningMode binningMode) {
    this.binningMode = binningMode;
  }

  public Integer getNumberOfBins() {
    return numberOfBins;
  }

  public void setNumberOfBins(Integer numberOfBins) {
    this.numberOfBins = numberOfBins;
  }

  public List<HistogramBin> getBins() {
    return bins;
  }

  public void addBins(List<HistogramBin> bins) {
    bins.forEach(bin -> bin.setHistogramChartConfiguration(this));
    this.bins.addAll(bins);
  }

  public void removeBins() {
    this.bins.forEach(bin -> bin.setHistogramChartConfiguration(null));
    this.bins.clear();
  }

  public BigDecimal getMinBin() {
    return minBin;
  }

  public void setMinBin(BigDecimal minBin) {
    this.minBin = minBin;
  }

  public BigDecimal getMaxBin() {
    return maxBin;
  }

  public void setMaxBin(BigDecimal maxBin) {
    this.maxBin = maxBin;
  }
}
