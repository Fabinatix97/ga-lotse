/*
 * Copyright 2024 cronn GmbH
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
import jakarta.persistence.OrderColumn;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;

@DataSensitivity(SENSITIVE)
@Entity
@Table(indexes = @Index(columnList = "bar_chart_data_id"))
public class BarGroupData extends BaseEntity {
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "bar_chart_data_id")
  private BarChartData barChartData;

  @Column(nullable = false)
  private String key;

  @OneToMany(
      cascade = CascadeType.PERSIST,
      fetch = FetchType.LAZY,
      mappedBy = KeyToCount_.BAR_GROUP_DATA,
      orphanRemoval = true)
  @OrderColumn
  private final List<KeyToCount> keyToCounts = new ArrayList<>();

  void setBarChartData(BarChartData barChartData) {
    this.barChartData = barChartData;
  }

  public String getKey() {
    return key;
  }

  public void setKey(String key) {
    this.key = key;
  }

  public List<KeyToCount> getKeyToCounts() {
    return keyToCounts;
  }

  public void addKeyToCounts(List<KeyToCount> keyToCounts) {
    keyToCounts.forEach(keyToCount -> keyToCount.setBarGroupData(this));
    this.keyToCounts.addAll(keyToCounts);
  }
}
