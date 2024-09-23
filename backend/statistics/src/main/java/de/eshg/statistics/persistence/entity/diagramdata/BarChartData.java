/*
 * Copyright 2024 cronn GmbH
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
@DiscriminatorValue("BAR_CHART_DATA")
public class BarChartData extends DiagramData {
  @OneToMany(
      cascade = CascadeType.PERSIST,
      fetch = FetchType.LAZY,
      mappedBy = BarGroupData_.BAR_CHART_DATA,
      orphanRemoval = true)
  @OrderColumn
  private final List<BarGroupData> barGroupDatas = new ArrayList<>();

  public List<BarGroupData> getBarGroupDatas() {
    return barGroupDatas;
  }

  public void addBarGroupDatas(List<BarGroupData> barGroupDatas) {
    barGroupDatas.forEach(barGroupData -> barGroupData.setBarChartData(this));
    this.barGroupDatas.addAll(barGroupDatas);
  }
}
