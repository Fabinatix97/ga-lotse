/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.appointment.persistence.entity;

import de.eshg.domain.model.GloballyUniqueEntityBase;
import de.eshg.lib.appointmentblock.EntityWithAppointment;
import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import de.eshg.lib.appointmentblock.persistence.entity.Appointment;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import de.eshg.officialmedicalservice.procedure.persistence.entity.OmsProcedure;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@DataSensitivity(SensitivityLevel.UNDEFINED)
@Entity
@EntityListeners({AuditingEntityListener.class})
@Table(indexes = @Index(columnList = "oms_procedure_id"))
public class OmsAppointment extends GloballyUniqueEntityBase implements EntityWithAppointment {
  @NotNull
  @Column
  @JdbcType(PostgreSQLEnumJdbcType.class)
  private AppointmentType appointmentType;

  @NotNull
  @Column()
  @JdbcType(PostgreSQLEnumJdbcType.class)
  private AppointmentState appointmentState;

  @NotNull
  @Column()
  @JdbcType(PostgreSQLEnumJdbcType.class)
  private BookingState bookingState;

  @Column()
  @JdbcType(PostgreSQLEnumJdbcType.class)
  private BookingType bookingType;

  @Column private Instant start;

  @Column private Integer duration;

  @NotNull @Column @CreatedDate private Instant createdAt;

  @NotNull @Column @LastModifiedDate private Instant modifiedAt;

  @ManyToOne(optional = false)
  @JoinColumn(name = "oms_procedure_id")
  private OmsProcedure procedure;

  @OneToOne(
      cascade = {CascadeType.PERSIST, CascadeType.REMOVE},
      orphanRemoval = true)
  private Appointment appointment;

  public OmsAppointment(AppointmentType appointmentType) {
    this.appointmentType = appointmentType;
    this.appointmentState = AppointmentState.OPEN;
    this.bookingState = BookingState.BOOKABLE;
  }

  public OmsAppointment() {}

  public AppointmentType getAppointmentType() {
    return appointmentType;
  }

  public void setAppointmentType(AppointmentType appointmentType) {
    this.appointmentType = appointmentType;
  }

  public AppointmentState getAppointmentState() {
    return appointmentState;
  }

  public void setAppointmentState(AppointmentState appointmentState) {
    this.appointmentState = appointmentState;
  }

  public BookingState getBookingState() {
    return bookingState;
  }

  public void setBookingState(BookingState bookingState) {
    this.bookingState = bookingState;
  }

  public BookingType getBookingType() {
    return bookingType;
  }

  public void setBookingType(BookingType bookingType) {
    this.bookingType = bookingType;
  }

  public Instant getStart() {
    return start;
  }

  public void setStart(Instant start) {
    this.start = start;
  }

  public Integer getDuration() {
    return duration;
  }

  public void setDuration(Integer duration) {
    this.duration = duration;
  }

  //  public Instant getCreatedAt() {
  //    return createdAt;
  //  }
  //
  //  public Instant getModifiedAt() {
  //    return modifiedAt;
  //  }

  public OmsProcedure getProcedure() {
    return procedure;
  }

  public void setProcedure(OmsProcedure procedure) {
    this.procedure = procedure;
  }

  public Appointment getAppointment() {
    return appointment;
  }

  public void setAppointment(Appointment appointment) {
    this.appointment = appointment;
  }
}
