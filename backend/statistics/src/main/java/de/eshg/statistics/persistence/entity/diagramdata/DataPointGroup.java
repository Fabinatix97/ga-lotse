/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.persistence.entity.diagramdata;

import static de.eshg.lib.common.SensitivityLevel.SENSITIVE;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;

@DataSensitivity(SENSITIVE)
@Entity
@Table(indexes = {@Index(columnList = "line_or_scatter_chart_data_id")})
public class DataPointGroup extends BaseEntity {
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "line_or_scatter_chart_data_id")
  private LineOrScatterChartData lineOrScatterChartData;

  @Column private String key;

  @OneToMany(
      cascade = CascadeType.PERSIST,
      fetch = FetchType.LAZY,
      mappedBy = DataPoint_.DATA_POINT_GROUP,
      orphanRemoval = true)
  @OrderColumn
  private final List<DataPoint> dataPoints = new ArrayList<>();

  @OneToOne(
      cascade = CascadeType.PERSIST,
      fetch = FetchType.LAZY,
      mappedBy = TrendLine_.DATA_POINT_GROUP,
      orphanRemoval = true)
  private TrendLine trendLine;

  void setLineOrScatterChartData(LineOrScatterChartData lineOrScatterChartData) {
    this.lineOrScatterChartData = lineOrScatterChartData;
  }

  public String getKey() {
    return key;
  }

  public void setKey(String key) {
    this.key = key;
  }

  public List<DataPoint> getDataPoints() {
    return dataPoints;
  }

  public void addDataPoints(List<DataPoint> dataPoints) {
    dataPoints.forEach(dataPoint -> dataPoint.setDataPointGroup(this));
    this.dataPoints.addAll(dataPoints);
  }

  public TrendLine getTrendLine() {
    return trendLine;
  }

  public void setTrendLine(TrendLine trendLine) {
    if (trendLine != null) {
      trendLine.setDataPointGroup(this);
    }
    this.trendLine = trendLine;
  }
}
