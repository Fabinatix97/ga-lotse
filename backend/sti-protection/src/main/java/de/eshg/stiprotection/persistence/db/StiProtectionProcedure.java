/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.persistence.db;

import static java.lang.Boolean.TRUE;

import de.eshg.lib.appointmentblock.EntityWithAppointment;
import de.eshg.lib.appointmentblock.persistence.entity.Appointment;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import de.eshg.lib.procedure.domain.model.Procedure;
import de.eshg.stiprotection.persistence.db.consultation.Consultation;
import de.eshg.stiprotection.persistence.db.consultation.Consultation_;
import de.eshg.stiprotection.persistence.db.diagnosis.Diagnosis;
import de.eshg.stiprotection.persistence.db.examination.LaboratoryTestExamination;
import de.eshg.stiprotection.persistence.db.examination.LaboratoryTestExamination_;
import de.eshg.stiprotection.persistence.db.examination.RapidTestExamination;
import de.eshg.stiprotection.persistence.db.examination.RapidTestExamination_;
import de.eshg.stiprotection.persistence.db.medicalhistory.MedicalHistory;
import de.eshg.stiprotection.persistence.db.medicalhistory.MedicalHistory_;
import de.eshg.stiprotection.persistence.db.waitingroom.WaitingRoom;
import de.eshg.stiprotection.persistence.db.waitingroom.WaitingRoom_;
import jakarta.persistence.CascadeType;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Transient;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;
import org.springframework.util.Assert;

@Entity
public class StiProtectionProcedure
    extends Procedure<StiProtectionProcedure, StiProtectionTask, Person, Facility>
    implements EntityWithAppointment {

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  @Column(nullable = false)
  private Concern concern;

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @Column(nullable = false)
  private Boolean isFollowUp = false;

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @OneToOne(
      mappedBy = MedicalHistory_.PROCEDURE,
      cascade = CascadeType.PERSIST,
      orphanRemoval = true,
      fetch = FetchType.LAZY)
  private MedicalHistory medicalHistory;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  @OneToOne(
      mappedBy = RapidTestExamination_.PROCEDURE,
      cascade = CascadeType.PERSIST,
      orphanRemoval = true,
      fetch = FetchType.LAZY)
  private RapidTestExamination rapidTestExamination;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  @OneToOne(
      mappedBy = LaboratoryTestExamination_.PROCEDURE,
      cascade = CascadeType.PERSIST,
      orphanRemoval = true,
      fetch = FetchType.LAZY)
  private LaboratoryTestExamination laboratoryTestExamination;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  @OneToOne(
      mappedBy = Consultation_.PROCEDURE,
      cascade = CascadeType.PERSIST,
      orphanRemoval = true,
      fetch = FetchType.LAZY)
  private Consultation consultation;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  @OneToOne(
      mappedBy = "procedure",
      cascade = CascadeType.PERSIST,
      orphanRemoval = true,
      fetch = FetchType.LAZY)
  private Diagnosis diagnosis;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @OneToOne(orphanRemoval = true, cascade = CascadeType.PERSIST)
  private Appointment appointment;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @OneToOne(
      orphanRemoval = true,
      fetch = FetchType.LAZY,
      cascade = CascadeType.ALL,
      mappedBy = UserDefinedAppointment_.PROCEDURE)
  private UserDefinedAppointment userDefinedAppointment;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  @Column(unique = true)
  private UUID calendarEventId;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  @ElementCollection
  @CollectionTable(
      name = "appointment_history",
      joinColumns = @JoinColumn(name = "procedure_id", nullable = false))
  @OrderColumn
  private final List<AppointmentHistoryEntry> appointmentHistory = new ArrayList<>();

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @OneToOne(
      mappedBy = WaitingRoom_.PROCEDURE,
      cascade = CascadeType.PERSIST,
      orphanRemoval = true,
      fetch = FetchType.LAZY)
  private WaitingRoom waitingRoom;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  @Column(nullable = false)
  private LabStatus labStatus;

  @Transient
  public Person getPerson() {
    Assert.isTrue(getRelatedPersons().size() == 1, "There should be exactly one related person");
    return getRelatedPersons().getFirst();
  }

  public Concern getConcern() {
    return concern;
  }

  public void setConcern(Concern concern) {
    this.concern = concern;
  }

  public Boolean isFollowUp() {
    return isFollowUp;
  }

  public void setFollowUp(Boolean followUp) {
    isFollowUp = followUp;
  }

  public MedicalHistory getMedicalHistory() {
    return medicalHistory;
  }

  public void setMedicalHistory(MedicalHistory medicalHistory) {
    if (medicalHistory == null) {
      if (this.medicalHistory != null) {
        this.medicalHistory.setProcedure(null);
      }
    } else {
      medicalHistory.setProcedure(this);
    }
    this.medicalHistory = medicalHistory;
  }

  public RapidTestExamination getRapidTestExamination() {
    return rapidTestExamination;
  }

  public void setRapidTestExamination(RapidTestExamination rapidTestExamination) {
    if (rapidTestExamination == null) {
      if (this.rapidTestExamination != null) {
        this.rapidTestExamination.setProcedure(null);
      }
    } else {
      rapidTestExamination.setProcedure(this);
    }
    this.rapidTestExamination = rapidTestExamination;
  }

  public LaboratoryTestExamination getLaboratoryTestExamination() {
    return laboratoryTestExamination;
  }

  public void setLaboratoryTestExamination(LaboratoryTestExamination laboratoryTestExamination) {
    if (laboratoryTestExamination == null) {
      if (this.laboratoryTestExamination != null) {
        this.laboratoryTestExamination.setProcedure(null);
      }
    } else {
      laboratoryTestExamination.setProcedure(this);
    }
    this.laboratoryTestExamination = laboratoryTestExamination;
  }

  public Consultation getConsultation() {
    return consultation;
  }

  public void setConsultation(Consultation consultation) {
    if (consultation == null) {
      if (this.consultation != null) {
        this.consultation.setProcedure(null);
      }
    } else {
      consultation.setProcedure(this);
    }
    this.consultation = consultation;
  }

  public Diagnosis getDiagnosis() {
    return diagnosis;
  }

  public void setDiagnosis(Diagnosis diagnosis) {
    if (diagnosis == null) {
      if (this.diagnosis != null) {
        this.diagnosis.setProcedure(null);
      }
    } else {
      diagnosis.setProcedure(this);
    }
    this.diagnosis = diagnosis;
  }

  public Appointment getAppointment() {
    return appointment;
  }

  public void setAppointment(Appointment appointment) {
    if (appointment != null) {
      Assert.isNull(
          userDefinedAppointment,
          "You must cancel a user-defined appointment before scheduling a new appointment.");
    }
    this.appointment = appointment;
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

  public UUID getCalendarEventId() {
    return calendarEventId;
  }

  public void setCalendarEventId(UUID calendarEventId) {
    this.calendarEventId = calendarEventId;
  }

  public List<AppointmentHistoryEntry> getAppointmentHistory() {
    return this.appointmentHistory;
  }

  public WaitingRoom getWaitingRoom() {
    return waitingRoom;
  }

  public void setWaitingRoom(WaitingRoom waitingRoom) {
    this.waitingRoom = waitingRoom;
    waitingRoom.setProcedure(this);
  }

  @PrePersist
  @PreUpdate
  public void computeLabStatus() {
    labStatus = LabStatus.OPEN;
    if (laboratoryTestExamination != null
        && Objects.nonNull(laboratoryTestExamination.getTestsConductedDate())) {
      labStatus = LabStatus.IN_PROGRESS;
    }
    if (diagnosis != null && TRUE.equals(diagnosis.getResultsCommunicated())) {
      labStatus = LabStatus.CLOSED;
    }
  }

  public LabStatus getLabStatus() {
    return labStatus;
  }
}
