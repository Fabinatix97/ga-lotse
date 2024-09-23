/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.inspection.persistence;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import java.time.Instant;

@Entity
public class InspectionTravelTime extends BaseEntity {

  @Column
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private Integer startBufferInMinutes;

  @Column
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private Instant startTime;

  @Column
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private Integer endBufferInMinutes;

  @Column
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private Instant endTime;

  public Integer getStartBufferInMinutes() {
    return startBufferInMinutes;
  }

  public void setStartBufferInMinutes(Integer startBufferInMinutes) {
    this.startBufferInMinutes = startBufferInMinutes;
  }

  public Instant getStartTime() {
    return startTime;
  }

  public void setStartTime(Instant startTime) {
    this.startTime = startTime;
  }

  public Integer getEndBufferInMinutes() {
    return endBufferInMinutes;
  }

  public void setEndBufferInMinutes(Integer endBufferInMinutes) {
    this.endBufferInMinutes = endBufferInMinutes;
  }

  public Instant getEndTime() {
    return endTime;
  }

  public void setEndTime(Instant endTime) {
    this.endTime = endTime;
  }
}
