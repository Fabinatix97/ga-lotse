/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.persistence.entity.diagramdata;

import static de.eshg.lib.common.SensitivityLevel.SENSITIVE;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToOne;
import java.math.BigDecimal;

@DataSensitivity(SENSITIVE)
@Entity
public class TrendLine extends BaseEntity {
  @OneToOne(fetch = FetchType.LAZY, optional = false)
  private DataPointGroup dataPointGroup;

  @Column(precision = 10, scale = 4, nullable = false)
  private BigDecimal lineSlope;

  @Column(precision = 10, scale = 4, nullable = false)
  private BigDecimal lineOffset;

  void setDataPointGroup(DataPointGroup dataPointGroup) {
    this.dataPointGroup = dataPointGroup;
  }

  public BigDecimal getLineSlope() {
    return lineSlope;
  }

  public void setLineSlope(BigDecimal slope) {
    this.lineSlope = slope;
  }

  public BigDecimal getLineOffset() {
    return lineOffset;
  }

  public void setLineOffset(BigDecimal trendLineOffset) {
    this.lineOffset = trendLineOffset;
  }
}
