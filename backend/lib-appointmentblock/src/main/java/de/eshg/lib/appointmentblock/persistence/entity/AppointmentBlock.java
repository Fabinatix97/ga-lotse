/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock.persistence.entity;

import de.eshg.domain.model.BaseEntityWithExternalId;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import org.hibernate.annotations.BatchSize;

@Entity
@Table(indexes = {@Index(columnList = "appointment_block_group_id"), @Index(columnList = "room")})
public class AppointmentBlock extends BaseEntityWithExternalId {

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Column(nullable = false, unique = true)
  private UUID calendarEventId;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Column(nullable = false)
  private Instant appointmentBlockStart;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Column(nullable = false)
  private Instant appointmentBlockEnd;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  private int parallelExaminations;

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @ElementCollection
  @Column(name = "physician_id", nullable = false)
  @OrderColumn
  private List<UUID> physicians = new ArrayList<>();

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @ElementCollection
  @Column(name = "mfa_id", nullable = false)
  @OrderColumn
  private List<UUID> mfas = new ArrayList<>();

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @ElementCollection
  @Column(name = "consultant_id", nullable = false)
  @OrderColumn
  private List<UUID> consultants = new ArrayList<>();

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @ElementCollection
  @Column(name = "sopass_id", nullable = false)
  @OrderColumn
  private List<UUID> sopasss = new ArrayList<>();

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private String room;

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private Boolean availableForCitizen;

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private Boolean availableForBulkBooking;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @ManyToOne(optional = false)
  @JoinColumn(name = "appointment_block_group_id")
  private AppointmentBlockGroup appointmentBlockGroup;

  @DataSensitivity(SensitivityLevel.PUBLIC)
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

  public int getParallelExaminations() {
    return parallelExaminations;
  }

  public void setParallelExaminations(int parallelExaminations) {
    this.parallelExaminations = parallelExaminations;
  }

  public List<UUID> getPhysicians() {
    return physicians;
  }

  public void setPhysicians(List<UUID> physicians) {
    this.physicians = physicians;
  }

  public List<UUID> getMfas() {
    return mfas;
  }

  public void setMfas(List<UUID> mfas) {
    this.mfas = mfas;
  }

  public List<UUID> getConsultants() {
    return consultants;
  }

  public void setConsultants(List<UUID> consultants) {
    this.consultants = consultants;
  }

  public List<UUID> getSopasss() {
    return sopasss;
  }

  public void setSopasss(List<UUID> sopasss) {
    this.sopasss = sopasss;
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

  public String getRoom() {
    return room;
  }

  public void setRoom(String room) {
    this.room = room;
  }

  public Boolean isAvailableForBulkBooking() {
    return availableForBulkBooking;
  }

  public void setAvailableForBulkBooking(Boolean availableForBulkBooking) {
    this.availableForBulkBooking = availableForBulkBooking;
  }

  public Boolean isAvailableForCitizen() {
    return availableForCitizen;
  }

  public void setAvailableForCitizen(Boolean availableForCitizen) {
    this.availableForCitizen = availableForCitizen;
  }
}
