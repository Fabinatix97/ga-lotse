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
@DiscriminatorValue("CHOROPLETH_MAP_DATA")
public class ChoroplethMapData extends DiagramData {
  @OneToMany(
      cascade = CascadeType.PERSIST,
      fetch = FetchType.LAZY,
      mappedBy = KeyToValue_.CHOROPLETH_MAP_DATA,
      orphanRemoval = true)
  @OrderColumn
  private final List<KeyToValue> keyToValues = new ArrayList<>();

  public List<KeyToValue> getKeyToValues() {
    return keyToValues;
  }

  public void addKeyToValues(List<KeyToValue> keyToValues) {
    keyToValues.forEach(keyToValue -> keyToValue.setChoroplethMapData(this));
    this.keyToValues.addAll(keyToValues);
  }
}
