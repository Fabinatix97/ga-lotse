/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock.persistence.entity;

import de.eshg.domain.model.BaseEntityWithExternalId;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.UUID;
import org.hibernate.annotations.BatchSize;

@Entity
@DataSensitivity(SensitivityLevel.PUBLIC)
@Table(indexes = @Index(columnList = "appointment_block_group_id"))
public class AppointmentBlock extends BaseEntityWithExternalId {

  @Column(nullable = false, unique = true)
  private UUID calendarEventId;

  @Column(nullable = false)
  private Instant appointmentBlockStart;

  @Column(nullable = false)
  private Instant appointmentBlockEnd;

  @ManyToOne(optional = false)
  @JoinColumn(name = "appointment_block_group_id")
  private AppointmentBlockGroup appointmentBlockGroup;

  @OneToMany(mappedBy = Appointment_.APPOINTMENT_BLOCK)
  @OrderBy
  @BatchSize(size = 100)
  private final Set<Appointment> appointments = new LinkedHashSet<>();

  public UUID getCalendarEventId() {
    return calendarEventId;
  }

  public Instant getAppointmentBlockStart() {
    return appointmentBlockStart;
  }

  public void setAppointmentBlockStart(Instant appointmentBlockStart) {
    this.appointmentBlockStart = appointmentBlockStart;
  }

  public Instant getAppointmentBlockEnd() {
    return appointmentBlockEnd;
  }

  public void setAppointmentBlockEnd(Instant appointmentBlockEnd) {
    this.appointmentBlockEnd = appointmentBlockEnd;
  }

  public void setCalendarEventId(UUID calendarEventId) {
    this.calendarEventId = calendarEventId;
  }

  public AppointmentBlockGroup getAppointmentBlockGroup() {
    return appointmentBlockGroup;
  }

  void setAppointmentBlockGroup(AppointmentBlockGroup appointmentBlockGroup) {
    this.appointmentBlockGroup = appointmentBlockGroup;
  }

  public Set<Appointment> getAppointments() {
    return appointments;
  }
}
