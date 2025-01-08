/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.persistence.entity.diagramdata;

import static de.eshg.lib.common.SensitivityLevel.SENSITIVE;

import de.eshg.lib.common.DataSensitivity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderColumn;
import java.util.ArrayList;
import java.util.List;

@DataSensitivity(SENSITIVE)
@Entity
@DiscriminatorValue("HISTOGRAM_CHART_DATA")
public class HistogramChartData extends DiagramData {
  @OneToMany(
      cascade = CascadeType.PERSIST,
      fetch = FetchType.LAZY,
      mappedBy = HistogramGroupData_.HISTOGRAM_CHART_DATA,
      orphanRemoval = true)
  @OrderColumn
  private final List<HistogramGroupData> histogramGroupDatas = new ArrayList<>();

  public List<HistogramGroupData> getHistogramGroupDatas() {
    return histogramGroupDatas;
  }

  public void addHistogramGroupDatas(List<HistogramGroupData> histogramGroupDatas) {
    histogramGroupDatas.forEach(this::addHistogramGroupData);
  }

  public void addHistogramGroupData(HistogramGroupData histogramGroupData) {
    histogramGroupData.setHistogramChartData(this);
    this.histogramGroupDatas.add(histogramGroupData);
  }
}
