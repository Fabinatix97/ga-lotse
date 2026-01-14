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
@Table(indexes = {@Index(columnList = "data_point_group_id")})
public class DataPoint extends BaseEntity {
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "data_point_group_id")
  private DataPointGroup dataPointGroup;

  @Column(precision = 10, scale = 4, nullable = false)
  private BigDecimal xCoordinate;

  @Column(precision = 10, scale = 4, nullable = false)
  private BigDecimal yCoordinate;

  void setDataPointGroup(DataPointGroup dataPointGroup) {
    this.dataPointGroup = dataPointGroup;
  }

  public BigDecimal getXCoordinate() {
    return xCoordinate;
  }

  public void setXCoordinate(BigDecimal xCoordinate) {
    this.xCoordinate = xCoordinate;
  }

  public BigDecimal getYCoordinate() {
    return yCoordinate;
  }

  public void setYCoordinate(BigDecimal yCoordinate) {
    this.yCoordinate = yCoordinate;
  }
}
