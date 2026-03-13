/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.domain.model;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import java.util.ArrayList;
import java.util.List;
import org.hibernate.annotations.BatchSize;

@Entity
@DataSensitivity(SensitivityLevel.PUBLIC)
public class SchoolEntryDeviceRegistryConfig extends BaseEntity {

  @OneToMany(
      fetch = FetchType.LAZY,
      cascade = {CascadeType.ALL},
      orphanRemoval = true)
  @OrderBy
  @BatchSize(size = 100)
  private final List<MeasuringDevice> measuringDevices = new ArrayList<>();

  @Column(nullable = false)
  private boolean hearingTestDeviceMeasuring = false;

  @Column(nullable = false)
  private boolean seeingTestDeviceMeasuring = false;

  public List<MeasuringDevice> getMeasuringDevices() {
    return measuringDevices;
  }

  public void addMeasuringDevice(MeasuringDevice measuringDevice) {
    this.measuringDevices.add(measuringDevice);
  }

  public void removeMeasuringDevice(MeasuringDevice measuringDevice) {
    this.measuringDevices.remove(measuringDevice);
  }

  public boolean isHearingTestDeviceMeasuring() {
    return hearingTestDeviceMeasuring;
  }

  public void setHearingTestDeviceMeasuring(boolean hearingTestDeviceMeasuring) {
    this.hearingTestDeviceMeasuring = hearingTestDeviceMeasuring;
  }

  public boolean isSeeingTestDeviceMeasuring() {
    return seeingTestDeviceMeasuring;
  }

  public void setSeeingTestDeviceMeasuring(boolean seeingTestDeviceMeasuring) {
    this.seeingTestDeviceMeasuring = seeingTestDeviceMeasuring;
  }
}
