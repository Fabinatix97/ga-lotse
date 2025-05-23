/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.persistence.db;

import de.eshg.domain.model.BaseEntity;
import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import java.time.Instant;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@DataSensitivity(SensitivityLevel.PUBLIC)
@Table(
    indexes = {
      @Index(name = "idx_appointment_cooldown_created_at", columnList = "created_at"),
      @Index(
          name = "idx_appointment_cooldown_start_end_type",
          columnList = "appointmentStart,appointmentEnd,type")
    })
@EntityListeners(AuditingEntityListener.class)
public class AppointmentCooldown extends BaseEntity {

  @Column(nullable = false)
  @CreatedDate
  private Instant createdAt;

  @Column(nullable = false)
  private Instant appointmentStart;

  @Column(nullable = false)
  private Instant appointmentEnd;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  @Column(nullable = false)
  private AppointmentType type;

  public AppointmentCooldown() {}

  public AppointmentCooldown(
      Instant appointmentStart, Instant appointmentEnd, AppointmentType type) {
    this.appointmentStart = appointmentStart;
    this.appointmentEnd = appointmentEnd;
    this.type = type;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(Instant createdAt) {
    this.createdAt = createdAt;
  }

  public Instant getAppointmentStart() {
    return appointmentStart;
  }

  public void setAppointmentStart(Instant appointmentStart) {
    this.appointmentStart = appointmentStart;
  }

  public Instant getAppointmentEnd() {
    return appointmentEnd;
  }

  public void setAppointmentEnd(Instant appointmentEnd) {
    this.appointmentEnd = appointmentEnd;
  }

  public AppointmentType getType() {
    return type;
  }

  public void setType(AppointmentType type) {
    this.type = type;
  }
}
