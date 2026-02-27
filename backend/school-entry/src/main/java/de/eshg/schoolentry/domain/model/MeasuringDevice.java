/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.domain.model;

import de.eshg.domain.model.BaseEntityWithExternalId;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Entity
@DataSensitivity(value = SensitivityLevel.PUBLIC)
public class MeasuringDevice extends BaseEntityWithExternalId {

  @Column(nullable = false)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  private MeasuringDeviceType measuringDeviceType;

  @Column(nullable = false, unique = true)
  private String equipmentSelector;

  @Column(unique = true, nullable = false)
  private String name;

  @Column(nullable = false)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  private GdtDriver driver;

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public MeasuringDeviceType getMeasuringDeviceType() {
    return measuringDeviceType;
  }

  public void setMeasuringDeviceType(MeasuringDeviceType measuringDeviceType) {
    this.measuringDeviceType = measuringDeviceType;
  }

  public String getEquipmentSelector() {
    return equipmentSelector;
  }

  public void setEquipmentSelector(String equipmentSelector) {
    this.equipmentSelector = equipmentSelector;
  }

  public GdtDriver getDriver() {
    return driver;
  }

  public void setDriver(GdtDriver driver) {
    this.driver = driver;
  }
}
