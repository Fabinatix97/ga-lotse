/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.domain.model;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.lib.appointmentblock.EntityWithAppointment;
import de.eshg.lib.appointmentblock.persistence.entity.Appointment;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import de.eshg.lib.procedure.domain.model.BasicSystemProgressEntryType;
import de.eshg.lib.procedure.domain.model.Procedure;
import de.eshg.lib.procedure.domain.model.TaskType;
import de.eshg.lib.procedure.domain.model.TriggerType;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.OrderBy;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Stream;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;
import org.springframework.util.Assert;

@Entity
@DataSensitivity(SensitivityLevel.SENSITIVE)
@Table(
    indexes = {
      @Index(
          name = "idx_prostitute_protection_procedure_appointment_start",
          columnList = "appointment_start"),
    })
public class ProstituteProtectionProcedure
    extends Procedure<ProstituteProtectionProcedure, ProstituteProtectionTask, Person, Facility>
    implements EntityWithAppointment {

  @OneToOne(orphanRemoval = true, cascade = CascadeType.PERSIST, fetch = FetchType.LAZY)
  private Appointment appointment;

  @OneToOne(
      orphanRemoval = true,
      fetch = FetchType.LAZY,
      cascade = CascadeType.ALL,
      mappedBy = UserDefinedAppointment_.PROCEDURE)
  private UserDefinedAppointment userDefinedAppointment;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  private ConsultationType consultationType;

  private Integer ageAtConsultation;

  @OneToOne(
      orphanRemoval = true,
      fetch = FetchType.LAZY,
      cascade = {CascadeType.PERSIST, CascadeType.REMOVE})
  private PersonalData personalData;

  @OneToOne(
      orphanRemoval = true,
      fetch = FetchType.LAZY,
      cascade = {CascadeType.PERSIST, CascadeType.REMOVE})
  private EncryptedPersonalData encryptedPersonalData;

  @OneToOne(
      optional = false,
      fetch = FetchType.LAZY,
      cascade = {CascadeType.PERSIST, CascadeType.REMOVE},
      mappedBy = Consultation_.PROCEDURE)
  private Consultation consultation;

  private Instant appointmentStart;

  private Instant consultationCertificateCreatedAt;

  private Boolean certificateWithAliasCreated;

  @OneToMany(
      mappedBy = EncryptedFile_.PROCEDURE,
      cascade = CascadeType.PERSIST,
      orphanRemoval = true)
  @OrderBy("createdAt ASC")
  private final List<EncryptedFile> encryptedFiles = new ArrayList<>();

  @OneToOne(
      optional = false,
      cascade = {CascadeType.PERSIST, CascadeType.REMOVE},
      mappedBy = WaitingRoom_.PROCEDURE,
      orphanRemoval = true)
  private WaitingRoom waitingRoom;

  private UUID consultantId;

  @Column(unique = true)
  private UUID calendarEventId;

  public ProstituteProtectionProcedure() {
    super();
  }

  public ProstituteProtectionProcedure(
      BasicSystemProgressEntryType basicSystemProgressEntryType, TriggerType triggerType) {
    super(basicSystemProgressEntryType, triggerType);
  }

  public ProstituteProtectionTask getTaskOfType(TaskType taskType) {
    return getTasksOfType(taskType).collect(StreamUtil.toSingleElement());
  }

  private Stream<ProstituteProtectionTask> getTasksOfType(TaskType taskType) {
    return getTasks().stream().filter(task -> task.getTaskType() == taskType);
  }

  @PrePersist
  @PreUpdate
  public void computeFieldValues() {
    computeAppointmentStart();
  }

  private void computeAppointmentStart() {
    if (userDefinedAppointment != null) {
      appointmentStart = userDefinedAppointment.getAppointmentStart();
    } else if (appointment != null) {
      appointmentStart = appointment.getAppointmentStart();
    }
  }

  public Instant getAppointmentStart() {
    return appointmentStart;
  }

  @Override
  public Appointment getAppointment() {
    return appointment;
  }

  @Override
  public void setAppointment(Appointment appointment) {
    this.appointment = appointment;
  }

  public ConsultationType getConsultationType() {
    return consultationType;
  }

  public void setConsultationType(ConsultationType consultationType) {
    this.consultationType = consultationType;
  }

  public UserDefinedAppointment getUserDefinedAppointment() {
    return userDefinedAppointment;
  }

  public void setUserDefinedAppointment(UserDefinedAppointment userDefinedAppointment) {
    if (userDefinedAppointment != null) {
      Assert.isNull(
          appointment, "You must cancel an appointment before scheduling a new user-defined one.");
    }
    if (userDefinedAppointment == null) {
      if (this.userDefinedAppointment != null) {
        this.userDefinedAppointment.setProcedure(null);
      }
    } else {
      userDefinedAppointment.setProcedure(this);
    }
    this.userDefinedAppointment = userDefinedAppointment;
  }

  public EncryptedPersonalData getEncryptedPersonalData() {
    return encryptedPersonalData;
  }

  public void setEncryptedPersonalData(EncryptedPersonalData encryptedPersonalData) {
    this.encryptedPersonalData = encryptedPersonalData;
  }

  public Instant getConsultationCertificateCreatedAt() {
    return consultationCertificateCreatedAt;
  }

  public void setConsultationCertificateCreatedAt(Instant consultationCertificateCreatedAt) {
    this.consultationCertificateCreatedAt = consultationCertificateCreatedAt;
  }

  public Consultation getConsultation() {
    return consultation;
  }

  public void setConsultation(Consultation consultation) {
    this.consultation = consultation;
    this.consultation.setProcedure(this);
  }

  public Integer getAgeAtConsultation() {
    return ageAtConsultation;
  }

  public void setAgeAtConsultation(Integer ageAtConsultation) {
    this.ageAtConsultation = ageAtConsultation;
  }

  public PersonalData getPersonalData() {
    return personalData;
  }

  public void setPersonalData(PersonalData personalData) {
    this.personalData = personalData;
  }

  public Boolean getCertificateWithAliasCreated() {
    return certificateWithAliasCreated;
  }

  public void setCertificateWithAliasCreated(Boolean certificateWithAliasCreated) {
    this.certificateWithAliasCreated = certificateWithAliasCreated;
  }

  public List<EncryptedFile> getEncryptedFiles() {
    return encryptedFiles;
  }

  public void deleteEncryptedFiles() {
    encryptedFiles.clear();
  }

  public void addEncryptedFile(EncryptedFile encryptedFile) {
    encryptedFiles.add(encryptedFile);
  }

  public UUID getConsultantId() {
    return consultantId;
  }

  public void setConsultantId(UUID consultantId) {
    this.consultantId = consultantId;
  }

  public UUID getCalendarEventId() {
    return calendarEventId;
  }

  public void setCalendarEventId(UUID calendarEventId) {
    this.calendarEventId = calendarEventId;
  }

  public WaitingRoom getWaitingRoom() {
    return waitingRoom;
  }

  public void setWaitingRoom(WaitingRoom waitingRoom) {
    this.waitingRoom = waitingRoom;
    waitingRoom.setProcedure(this);
  }
}
