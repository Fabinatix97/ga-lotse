/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccinationconsultation.persistence.entity;

import de.eshg.domain.model.GloballyUniqueEntityBase;
import de.eshg.lib.appointmentblock.EntityWithAppointment;
import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import de.eshg.lib.appointmentblock.persistence.entity.Appointment;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import de.eshg.travelmedicine.document.medicalhistory.persistence.entity.MedicalHistory;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import org.hibernate.annotations.BatchSize;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(indexes = @Index(columnList = "vaccination_consultation_id"))
public class ProcedureStep extends GloballyUniqueEntityBase implements EntityWithAppointment {

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @NotNull
  @Column
  @JdbcType(PostgreSQLEnumJdbcType.class)
  private AppointmentType appointmentType;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @NotNull
  @Column
  private boolean isFollowUp;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Column
  private LocalDate earliestDate;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @NotNull
  @Column
  private int bookingsRemaining = 2;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @OneToOne(cascade = CascadeType.REMOVE, orphanRemoval = true)
  private UserDefinedAppointment userDefinedAppointment;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @OneToOne(
      optional = false,
      cascade = {CascadeType.PERSIST, CascadeType.REMOVE},
      orphanRemoval = true)
  private MedicalHistory medicalHistory;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @OneToMany(mappedBy = VcService_.PROCEDURE_STEP)
  @NotNull
  @OrderBy
  @BatchSize(size = 100)
  private final List<VcService> services = new ArrayList<>();

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @NotNull
  @Column
  @CreatedDate
  private Instant createdAt;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @NotNull
  @Column
  @LastModifiedDate
  private Instant modifiedAt;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @ManyToOne(optional = false)
  @JoinColumn(name = "vaccination_consultation_id")
  private VaccinationConsultation vaccinationConsultation;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @OneToOne(
      cascade = {CascadeType.PERSIST, CascadeType.REMOVE},
      orphanRemoval = true)
  private Appointment appointment;

  public ProcedureStep() {}

  public static ProcedureStep createInitialProcedureStep(AppointmentType appointmentType) {
    return new ProcedureStep(appointmentType, false, null);
  }

  public static ProcedureStep createFollowupProcedureStep(LocalDate earliestDate) {
    return new ProcedureStep(AppointmentType.VACCINATION, true, earliestDate);
  }

  protected ProcedureStep(
      AppointmentType appointmentType, boolean isFollowUp, LocalDate earliestDate) {
    this.appointmentType = appointmentType;
    this.isFollowUp = isFollowUp;
    this.earliestDate = earliestDate;
  }

  public AppointmentType getAppointmentType() {
    return appointmentType;
  }

  public void setAppointmentType(AppointmentType appointmentType) {
    this.appointmentType = appointmentType;
  }

  public boolean getIsFollowUp() {
    return isFollowUp;
  }

  public void setFollowUp(boolean followUp) {
    isFollowUp = followUp;
  }

  public LocalDate getEarliestDate() {
    return earliestDate;
  }

  public void setEarliestDate(LocalDate earliestDate) {
    this.earliestDate = earliestDate;
  }

  public int getBookingsRemaining() {
    return bookingsRemaining;
  }

  public void setBookingsRemaining(int bookingsRemaining) {
    this.bookingsRemaining = bookingsRemaining;
  }

  public UserDefinedAppointment getUserDefinedAppointment() {
    return userDefinedAppointment;
  }

  public void setUserDefinedAppointment(UserDefinedAppointment userDefinedAppointment) {
    this.userDefinedAppointment = userDefinedAppointment;
  }

  public VaccinationConsultation getVaccinationConsultation() {
    return vaccinationConsultation;
  }

  public void setVaccinationConsultation(VaccinationConsultation vaccinationConsultation) {
    this.vaccinationConsultation = vaccinationConsultation;
  }

  @Override
  public Appointment getAppointment() {
    return appointment;
  }

  @Override
  public void setAppointment(Appointment appointment) {
    this.appointment = appointment;
  }

  public MedicalHistory getMedicalHistory() {
    return medicalHistory;
  }

  public void setMedicalHistory(MedicalHistory medicalHistory) {
    this.medicalHistory = medicalHistory;
  }

  public List<VcService> getServices() {
    return services;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public Instant getModifiedAt() {
    return modifiedAt;
  }
}
