/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock.persistence.entity;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.Duration;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Entity
@DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
@Table(indexes = @Index(columnList = "appointment_block_group_id"))
public class AppointmentTypeHolder extends BaseEntity {
  @ManyToOne(optional = false)
  @JoinColumn(name = "appointment_block_group_id")
  private AppointmentBlockGroup appointmentBlockGroup;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  @Column(nullable = false)
  private AppointmentType type;

  @Column(nullable = false)
  private Duration slotDuration;

  public AppointmentBlockGroup getAppointmentBlockGroup() {
    return appointmentBlockGroup;
  }

  public void setAppointmentBlockGroup(AppointmentBlockGroup appointmentBlockGroup) {
    this.appointmentBlockGroup = appointmentBlockGroup;
  }

  public AppointmentType getType() {
    return type;
  }

  public void setType(AppointmentType type) {
    this.type = type;
  }

  public Duration getSlotDuration() {
    return slotDuration;
  }

  public void setSlotDuration(Duration slotDuration) {
    this.slotDuration = slotDuration;
  }
}
