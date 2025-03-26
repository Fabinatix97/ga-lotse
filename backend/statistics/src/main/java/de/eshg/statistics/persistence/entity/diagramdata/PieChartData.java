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
@DiscriminatorValue("PIE_CHART_DATA")
public class PieChartData extends DiagramData {

  @OneToMany(
      cascade = CascadeType.PERSIST,
      fetch = FetchType.LAZY,
      mappedBy = KeyToCount_.PIE_CHART_DATA,
      orphanRemoval = true)
  @OrderColumn
  private final List<KeyToCount> keyToCounts = new ArrayList<>();

  public List<KeyToCount> getKeyToCounts() {
    return keyToCounts;
  }

  public void addKeyToCounts(List<KeyToCount> keyToCounts) {
    keyToCounts.forEach(keyToCount -> keyToCount.setPieChartData(this));
    this.keyToCounts.addAll(keyToCounts);
  }

  public void removeKeyToCounts() {
    keyToCounts.forEach(keyToCount -> keyToCount.setPieChartData(null));
    keyToCounts.clear();
  }
}
