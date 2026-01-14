/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.persistence.entity.diagramdata;

import static de.eshg.lib.common.SensitivityLevel.SENSITIVE;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@DataSensitivity(SENSITIVE)
@Entity
@Table(
    indexes = {
      @Index(columnList = "bar_group_data_id"),
      @Index(columnList = "histogram_group_data_id"),
      @Index(columnList = "pie_chart_data_id")
    })
public class KeyToCount extends BaseEntity {
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "bar_group_data_id")
  private BarGroupData barGroupData;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "histogram_group_data_id")
  private HistogramGroupData histogramGroupData;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "pie_chart_data_id")
  private PieChartData pieChartData;

  @Column(nullable = false)
  private String key;

  @Column(nullable = false)
  private int count;

  void setBarGroupData(BarGroupData barGroupData) {
    this.barGroupData = barGroupData;
  }

  void setHistogramGroupData(HistogramGroupData histogramGroupData) {
    this.histogramGroupData = histogramGroupData;
  }

  void setPieChartData(PieChartData pieChartData) {
    this.pieChartData = pieChartData;
  }

  public String getKey() {
    return key;
  }

  public void setKey(String key) {
    this.key = key;
  }

  public int getCount() {
    return count;
  }

  public void setCount(int count) {
    this.count = count;
  }
}
