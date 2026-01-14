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
import java.math.BigDecimal;

@DataSensitivity(SENSITIVE)
@Entity
@Table(indexes = @Index(columnList = "choropleth_map_data_id"))
public class KeyToValue extends BaseEntity {
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "choropleth_map_data_id")
  private ChoroplethMapData choroplethMapData;

  @Column(nullable = false)
  private String key;

  @Column(precision = 10, scale = 4)
  private BigDecimal value;

  public String getKey() {
    return key;
  }

  public void setKey(String key) {
    this.key = key;
  }

  public BigDecimal getValue() {
    return value;
  }

  public void setValue(BigDecimal value) {
    this.value = value;
  }

  public void setChoroplethMapData(ChoroplethMapData choroplethMapData) {
    this.choroplethMapData = choroplethMapData;
  }
}
