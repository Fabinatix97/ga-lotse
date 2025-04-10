/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.procedure.persistence.entity;

import static de.eshg.lib.common.SensitivityLevel.PSEUDONYMIZED;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import de.eshg.lib.procedure.domain.model.Procedure;
import de.eshg.officialmedicalservice.anamnesis.persistence.entity.OmsAnamnesis;
import de.eshg.officialmedicalservice.anamnesis.persistence.entity.OmsAnamnesis_;
import de.eshg.officialmedicalservice.appointment.persistence.entity.OmsAppointment;
import de.eshg.officialmedicalservice.appointment.persistence.entity.OmsAppointment_;
import de.eshg.officialmedicalservice.document.persistence.entity.OmsDocument;
import de.eshg.officialmedicalservice.document.persistence.entity.OmsDocument_;
import de.eshg.officialmedicalservice.waitingroom.persistence.entity.WaitingRoom;
import de.eshg.officialmedicalservice.waitingroom.persistence.entity.WaitingRoom_;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Transient;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.hibernate.annotations.BatchSize;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Entity
public class OmsProcedure extends Procedure<OmsProcedure, OmsTask, Person, Facility> {
  @OneToMany(
      mappedBy = OmsAppointment_.PROCEDURE,
      cascade = {CascadeType.REMOVE})
  @OrderBy
  @BatchSize(size = 100)
  @DataSensitivity(SensitivityLevel.UNDEFINED)
  private final List<OmsAppointment> appointments = new ArrayList<>();

  @OneToOne(
      fetch = FetchType.LAZY,
      cascade = {CascadeType.PERSIST, CascadeType.REMOVE})
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  Concern concern;

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @Column
  private UUID physicianId;

  @OneToMany(
      mappedBy = OmsDocument_.OMS_PROCEDURE,
      cascade = {CascadeType.PERSIST, CascadeType.REMOVE},
      orphanRemoval = true)
  @OrderBy(OmsDocument_.DOCUMENT_TYPE_DE)
  @BatchSize(size = 100)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private final List<OmsDocument> documents = new ArrayList<>();

  @Column(nullable = false)
  @NotNull
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  private MedicalOpinionStatus medicalOpinionStatus;

  @Column(nullable = false)
  @NotNull
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  private MedicalOpinionResult medicalOpinionResult;

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @Column
  private String medicalOpinionComment;

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @Column(nullable = false)
  private boolean sendEmailNotifications = false;

  @OneToOne(
      optional = false,
      cascade = {CascadeType.PERSIST, CascadeType.REMOVE},
      mappedBy = WaitingRoom_.PROCEDURE,
      orphanRemoval = true)
  @DataSensitivity(PSEUDONYMIZED)
  private WaitingRoom waitingRoom;

  @Column
  @DataSensitivity(PSEUDONYMIZED)
  private LocalDate medicalOpinionCutOffDate;

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @Column
  private UUID citizenUserId;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Column
  private Instant startedAt;

  @OneToOne(
      cascade = {CascadeType.PERSIST, CascadeType.REMOVE},
      mappedBy = OmsAnamnesis_.PROCEDURE,
      orphanRemoval = true,
      fetch = FetchType.LAZY)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private OmsAnamnesis anamnesis;

  public Person findAffectedPerson() {
    if (getRelatedPersons().isEmpty()) {
      return null;
    }
    return getRelatedPersons().getFirst();
  }

  @Transient
  public Optional<Facility> getFacility() {
    return getRelatedFacilities().stream().collect(StreamUtil.toSingleOptionalElement());
  }

  public Concern getConcern() {
    return concern;
  }

  public void setConcern(Concern concern) {
    this.concern = concern;
  }

  public UUID getPhysicianId() {
    return physicianId;
  }

  public void setPhysicianId(UUID physicianId) {
    this.physicianId = physicianId;
  }

  public List<OmsAppointment> getAppointments() {
    return appointments;
  }

  public List<OmsDocument> getDocuments() {
    return documents;
  }

  public MedicalOpinionStatus getMedicalOpinionStatus() {
    return medicalOpinionStatus;
  }

  public void setMedicalOpinionStatus(MedicalOpinionStatus medicalOpinionStatus) {
    this.medicalOpinionStatus = medicalOpinionStatus;
  }

  public boolean isSendEmailNotifications() {
    return sendEmailNotifications;
  }

  public void setSendEmailNotifications(boolean sendEmailNotifications) {
    this.sendEmailNotifications = sendEmailNotifications;
  }

  public WaitingRoom getWaitingRoom() {
    return waitingRoom;
  }

  public void setWaitingRoom(WaitingRoom waitingRoom) {
    this.waitingRoom = waitingRoom;
    waitingRoom.setProcedure(this);
  }

  public UUID getCitizenUserId() {
    return citizenUserId;
  }

  public void setCitizenUserId(UUID citizenUserId) {
    this.citizenUserId = citizenUserId;
  }

  public Instant getStartedAt() {
    return startedAt;
  }

  public void setStartedAt(Instant startedAt) {
    this.startedAt = startedAt;
  }

  public @NotNull MedicalOpinionResult getMedicalOpinionResult() {
    return medicalOpinionResult;
  }

  public void setMedicalOpinionResult(@NotNull MedicalOpinionResult medicalOpinionResult) {
    this.medicalOpinionResult = medicalOpinionResult;
  }

  public String getMedicalOpinionComment() {
    return medicalOpinionComment;
  }

  public void setMedicalOpinionComment(String medicalOpinionComment) {
    this.medicalOpinionComment = medicalOpinionComment;
  }

  public LocalDate getMedicalOpinionCutOffDate() {
    return medicalOpinionCutOffDate;
  }

  public void setMedicalOpinionCutOffDate(LocalDate medicalOpinionCutOffDate) {
    this.medicalOpinionCutOffDate = medicalOpinionCutOffDate;
  }

  public OmsAnamnesis getAnamnesis() {
    return anamnesis;
  }

  public void setAnamnesis(OmsAnamnesis anamnesis) {
    this.anamnesis = anamnesis;
  }
}
