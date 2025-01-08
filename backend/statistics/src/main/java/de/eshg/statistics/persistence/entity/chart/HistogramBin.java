/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.persistence.entity.chart;

import static de.eshg.lib.common.SensitivityLevel.PUBLIC;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.statistics.persistence.entity.diagramdata.HistogramGroupData;
import de.eshg.statistics.persistence.entity.diagramdata.HistogramGroupData_;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@DataSensitivity(PUBLIC)
@Entity
@Table(indexes = @Index(columnList = "histogram_chart_configuration_id"))
public class HistogramBin extends BaseEntity {
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "histogram_chart_configuration_id")
  private HistogramChartConfiguration histogramChartConfiguration;

  @OneToMany(
      fetch = FetchType.LAZY,
      mappedBy = HistogramGroupData_.HISTOGRAM_BIN,
      orphanRemoval = true)
  @OrderBy
  private final List<HistogramGroupData> histogramGroupDatas = new ArrayList<>();

  @Column(precision = 10, scale = 4)
  private BigDecimal lowerBound;

  @Column(precision = 10, scale = 4)
  private BigDecimal upperBound;

  void setHistogramChartConfiguration(HistogramChartConfiguration histogramChartConfiguration) {
    this.histogramChartConfiguration = histogramChartConfiguration;
  }

  public void addHistogramGroupData(HistogramGroupData histogramGroupData) {
    histogramGroupData.setHistogramBin(this);
    this.histogramGroupDatas.add(histogramGroupData);
  }

  public BigDecimal getLowerBound() {
    return lowerBound;
  }

  public void setLowerBound(BigDecimal lowerBound) {
    this.lowerBound = lowerBound;
  }

  public BigDecimal getUpperBound() {
    return upperBound;
  }

  public void setUpperBound(BigDecimal upperBound) {
    this.upperBound = upperBound;
  }
}
