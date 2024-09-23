/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.persistence.entity.diagramdata;

import static de.eshg.lib.common.SensitivityLevel.SENSITIVE;

import de.eshg.lib.common.DataSensitivity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderColumn;
import java.util.ArrayList;
import java.util.List;

@DataSensitivity(SENSITIVE)
@Entity
@DiscriminatorValue("LINE_OR_SCATTER_CHART_DATA")
public class LineOrScatterChartData extends DiagramData {
  @Column(nullable = false)
  private boolean isLineChart;

  @OneToMany(
      cascade = CascadeType.PERSIST,
      fetch = FetchType.LAZY,
      mappedBy = DataPointGroup_.LINE_OR_SCATTER_CHART_DATA,
      orphanRemoval = true)
  @OrderColumn
  private final List<DataPointGroup> dataPointGroups = new ArrayList<>();

  public boolean isLineChart() {
    return isLineChart;
  }

  public void setLineChart(boolean lineChart) {
    isLineChart = lineChart;
  }

  public List<DataPointGroup> getDataPointGroups() {
    return dataPointGroups;
  }

  public void addDataPointGroups(List<DataPointGroup> dataPointGroups) {
    dataPointGroups.forEach(dataPointGroup -> dataPointGroup.setLineOrScatterChartData(this));
    this.dataPointGroups.addAll(dataPointGroups);
  }
}
