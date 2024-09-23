/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.persistence.entity.diagramdata;

import static de.eshg.lib.common.SensitivityLevel.SENSITIVE;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.statistics.persistence.entity.chart.HistogramBin;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;

@DataSensitivity(SENSITIVE)
@Entity
@Table(
    indexes = {
      @Index(columnList = "histogram_chart_data_id"),
      @Index(columnList = "histogram_bin_id")
    })
public class HistogramGroupData extends BaseEntity {
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "histogram_chart_data_id")
  private HistogramChartData histogramChartData;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "histogram_bin_id")
  private HistogramBin histogramBin;

  @Column private Integer count;

  @OneToMany(
      cascade = CascadeType.PERSIST,
      fetch = FetchType.LAZY,
      mappedBy = KeyToCount_.HISTOGRAM_GROUP_DATA,
      orphanRemoval = true)
  @OrderColumn
  private final List<KeyToCount> keyToCounts = new ArrayList<>();

  void setHistogramChartData(HistogramChartData histogramChartData) {
    this.histogramChartData = histogramChartData;
  }

  public HistogramBin getHistogramBin() {
    return histogramBin;
  }

  public void setHistogramBin(HistogramBin histogramBin) {
    this.histogramBin = histogramBin;
  }

  public Integer getCount() {
    return count;
  }

  public void setCount(Integer count) {
    this.count = count;
  }

  public List<KeyToCount> getKeyToCounts() {
    return keyToCounts;
  }

  public void addKeyToCounts(List<KeyToCount> keyToCounts) {
    keyToCounts.forEach(keyToCount -> keyToCount.setHistogramGroupData(this));
    this.keyToCounts.addAll(keyToCounts);
  }
}
