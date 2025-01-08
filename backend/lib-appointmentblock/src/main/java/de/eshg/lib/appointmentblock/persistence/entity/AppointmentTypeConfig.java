/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock.persistence.entity;

import de.eshg.domain.model.GloballyUniqueEntityBase;
import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Entity
@DataSensitivity(SensitivityLevel.PUBLIC)
@Table(name = AppointmentTypeConfig.TABLE_NAME)
public class AppointmentTypeConfig extends GloballyUniqueEntityBase {

  public static final String TABLE_NAME = "appointment_type_config";

  @JdbcType(PostgreSQLEnumJdbcType.class)
  @Column(nullable = false, unique = true)
  private AppointmentType appointmentType;

  private int standardDurationInMinutes;

  public AppointmentType getAppointmentType() {
    return appointmentType;
  }

  public void setAppointmentType(AppointmentType appointmentType) {
    this.appointmentType = appointmentType;
  }

  public int getStandardDurationInMinutes() {
    return standardDurationInMinutes;
  }

  public void setStandardDurationInMinutes(int standardDuration) {
    this.standardDurationInMinutes = standardDuration;
  }
}
