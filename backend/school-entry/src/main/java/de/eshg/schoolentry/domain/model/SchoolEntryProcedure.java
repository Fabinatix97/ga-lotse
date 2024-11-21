/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.domain.model;

import static de.eshg.lib.common.SensitivityLevel.PROTECTED;
import static de.eshg.lib.common.SensitivityLevel.PSEUDONYMIZED;
import static de.eshg.lib.common.SensitivityLevel.SENSITIVE;
import static de.eshg.schoolentry.population.CreateLabelsTask.INFORMATION_BLOCK_LABEL_NAME;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.lib.appointmentblock.EntityWithAppointment;
import de.eshg.lib.appointmentblock.persistence.entity.Appointment;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.procedure.domain.model.*;
import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDate;
import java.time.Year;
import java.util.*;
import java.util.function.Predicate;
import java.util.stream.Stream;
import org.hibernate.annotations.BatchSize;

@Entity
public class SchoolEntryProcedure
    extends Procedure<SchoolEntryProcedure, SchoolEntryTask, Person, Facility>
    implements EntityWithAppointment {

  @DataSensitivity(PSEUDONYMIZED)
  private UUID schoolId;

  @OneToOne(orphanRemoval = true, cascade = CascadeType.PERSIST)
  @DataSensitivity(PSEUDONYMIZED)
  private Appointment appointment;

  @OneToOne(
      optional = false,
      fetch = FetchType.LAZY,
      cascade = {CascadeType.PERSIST, CascadeType.REMOVE},
      mappedBy = WaitingRoom_.PROCEDURE)
  @DataSensitivity(PSEUDONYMIZED)
  private WaitingRoom waitingRoom;

  @Column(unique = true)
  @DataSensitivity(PSEUDONYMIZED)
  private UUID citizenUserId;

  @OneToOne(
      optional = false,
      fetch = FetchType.LAZY,
      cascade = {CascadeType.PERSIST, CascadeType.REMOVE},
      mappedBy = HearingTestResult_.PROCEDURE)
  @DataSensitivity(PSEUDONYMIZED)
  private HearingTestResult hearingTestResult;

  @OneToOne(
      optional = false,
      fetch = FetchType.LAZY,
      cascade = {CascadeType.PERSIST, CascadeType.REMOVE},
      mappedBy = EyeExaminationResult_.PROCEDURE)
  @DataSensitivity(PSEUDONYMIZED)
  private EyeExaminationResult eyeExaminationResult;

  @OneToOne(
      optional = false,
      fetch = FetchType.LAZY,
      cascade = {CascadeType.PERSIST, CascadeType.REMOVE},
      mappedBy = SopessExaminationResult_.PROCEDURE)
  @DataSensitivity(PSEUDONYMIZED)
  private SopessExaminationResult sopessExaminationResult;

  @OneToOne(
      optional = false,
      fetch = FetchType.LAZY,
      cascade = {CascadeType.PERSIST, CascadeType.REMOVE},
      mappedBy = DevelopmentScreening_.PROCEDURE)
  @DataSensitivity(PSEUDONYMIZED)
  private DevelopmentScreening developmentScreeningResult;

  @OneToOne(
      optional = false,
      fetch = FetchType.LAZY,
      cascade = {CascadeType.PERSIST, CascadeType.REMOVE},
      mappedBy = VaccinationStatus_.PROCEDURE)
  @DataSensitivity(PSEUDONYMIZED)
  private VaccinationStatus vaccinationStatus;

  @OneToOne(
      optional = false,
      fetch = FetchType.LAZY,
      cascade = {CascadeType.PERSIST, CascadeType.REMOVE},
      mappedBy = Anamnesis_.PROCEDURE)
  @DataSensitivity(PSEUDONYMIZED)
  private Anamnesis anamnesis;

  @ManyToMany
  @OrderBy
  @DataSensitivity(PSEUDONYMIZED)
  @BatchSize(size = 100)
  private List<Label> labels = new ArrayList<>();

  @DataSensitivity(PSEUDONYMIZED)
  private boolean isEntryLevel = false;

  @DataSensitivity(PSEUDONYMIZED)
  private boolean isInvitationSent = false;

  @DataSensitivity(SENSITIVE)
  private boolean isDeceased = false;

  @DataSensitivity(SENSITIVE)
  private LocalDate deceased;

  @DataSensitivity(PSEUDONYMIZED)
  private int appointmentChangesByCitizen;

  @DataSensitivity(PROTECTED)
  private Year schoolYear;

  @DataSensitivity(PSEUDONYMIZED)
  private UUID locationId;

  @DataSensitivity(PSEUDONYMIZED)
  private Instant schoolInfoLetterCreatedAt;

  @DataSensitivity(PSEUDONYMIZED)
  private LocalDate examinationDate;

  public UUID getSchoolId() {
    return schoolId;
  }

  public void setSchoolId(UUID schoolId) {
    this.schoolId = schoolId;
  }

  @Override
  public Appointment getAppointment() {
    return appointment;
  }

  @Override
  public void setAppointment(Appointment appointment) {
    this.appointment = appointment;
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

  public HearingTestResult getHearingTestResult() {
    return hearingTestResult;
  }

  public void setHearingTestResult(HearingTestResult hearingTestResult) {
    this.hearingTestResult = hearingTestResult;
    hearingTestResult.setProcedure(this);
  }

  public EyeExaminationResult getEyeExaminationResult() {
    return eyeExaminationResult;
  }

  public void setEyeExaminationResult(EyeExaminationResult eyeExaminationResult) {
    this.eyeExaminationResult = eyeExaminationResult;
    eyeExaminationResult.setProcedure(this);
  }

  public SopessExaminationResult getSopessExaminationResult() {
    return sopessExaminationResult;
  }

  public void setSopessExaminationResult(SopessExaminationResult sopessExaminationResult) {
    this.sopessExaminationResult = sopessExaminationResult;
    sopessExaminationResult.setProcedure(this);
  }

  public DevelopmentScreening getDevelopmentScreeningResult() {
    return developmentScreeningResult;
  }

  public void setDevelopmentScreeningResult(DevelopmentScreening developmentScreeningResult) {
    this.developmentScreeningResult = developmentScreeningResult;
    developmentScreeningResult.setProcedure(this);
  }

  public VaccinationStatus getVaccinationStatus() {
    return vaccinationStatus;
  }

  public void setVaccinationStatus(VaccinationStatus vaccinationStatus) {
    this.vaccinationStatus = vaccinationStatus;
    vaccinationStatus.setProcedure(this);
  }

  public Anamnesis getAnamnesis() {
    return anamnesis;
  }

  public void setAnamnesis(Anamnesis anamnesis) {
    this.anamnesis = anamnesis;
    anamnesis.setProcedure(this);
  }

  public List<Label> getLabels() {
    return labels;
  }

  public void setLabels(List<Label> labels) {
    this.labels = labels;
  }

  public void addLabel(Label label) {
    this.labels.add(label);
  }

  public boolean hasLabel(String labelName) {
    return getLabels().stream().anyMatch(label -> labelName.equals(label.getName()));
  }

  public boolean hasInformationBlock() {
    return hasLabel(INFORMATION_BLOCK_LABEL_NAME);
  }

  public boolean isEntryLevel() {
    return isEntryLevel;
  }

  public void setEntryLevel(boolean entryLevel) {
    isEntryLevel = entryLevel;
  }

  public boolean isInvitationSent() {
    return isInvitationSent;
  }

  public void setIsInvitationSent(boolean isInvitationSent) {
    this.isInvitationSent = isInvitationSent;
  }

  public UUID getChildIdFromCentralFile() {
    return getChild().getCentralFileStateId();
  }

  public Person getChild() {
    return getRelatedPersons().stream()
        .filter(Person::isChild)
        .collect(StreamUtil.toSingleElement());
  }

  public Stream<Person> getCustodians() {
    return getRelatedPersons().stream().filter(Person::isCustodian);
  }

  public boolean hasTaskOfType(TaskType taskType) {
    return hasTaskMatching(task -> task.getTaskType().equals(taskType));
  }

  private boolean hasTaskMatching(Predicate<SchoolEntryTask> predicate) {
    return getTasks().stream().anyMatch(predicate);
  }

  public SchoolEntryTask getTaskOfType(TaskType taskType) {
    return getTasksOfType(taskType).collect(StreamUtil.toSingleElement());
  }

  public Optional<SchoolEntryTask> getOptionalTaskOfType(TaskType taskType) {
    return getTasksOfType(taskType).collect(StreamUtil.toSingleOptionalElement());
  }

  private Stream<SchoolEntryTask> getTasksOfType(TaskType taskType) {
    return getTasks().stream().filter(task -> task.getTaskType() == taskType);
  }

  public boolean isDeceased() {
    return isDeceased;
  }

  public void setIsDeceased(boolean isDeceased) {
    this.isDeceased = isDeceased;
  }

  public LocalDate getDeceased() {
    return deceased;
  }

  public void setDeceased(LocalDate deceased) {
    this.deceased = deceased;
  }

  public int getAppointmentChangesByCitizen() {
    return appointmentChangesByCitizen;
  }

  public void setAppointmentChangesByCitizen(int appointmentChangeCount) {
    this.appointmentChangesByCitizen = appointmentChangeCount;
  }

  public Year getSchoolYear() {
    return schoolYear;
  }

  public void setSchoolYear(Year schoolYear) {
    this.schoolYear = schoolYear;
  }

  public UUID getLocationId() {
    return locationId;
  }

  public void setLocationId(UUID locationId) {
    this.locationId = locationId;
  }

  public Instant getSchoolInfoLetterCreatedAt() {
    return schoolInfoLetterCreatedAt;
  }

  public void setSchoolInfoLetterCreatedAt(Instant schoolInfoLetterCreatedAt) {
    this.schoolInfoLetterCreatedAt = schoolInfoLetterCreatedAt;
  }

  public LocalDate getExaminationDate() {
    return examinationDate;
  }

  public void setExaminationDate(LocalDate examinationDate) {
    this.examinationDate = examinationDate;
  }

  public boolean hasBeenClosed() {
    return getProgressEntries().stream()
        .anyMatch(
            progressEntry ->
                progressEntry instanceof SystemProgressEntry systemProgressEntry
                    && Objects.equals(
                        systemProgressEntry.getSystemProgressEntryType(),
                        BasicSystemProgressEntryType.CLOSED.name()));
  }

  public boolean isDeletable() {
    return getAppointment() == null
        && !getAnamnesis().hasEdits()
        && !getVaccinationStatus().hasEdits()
        && !getEyeExaminationResult().hasEdits()
        && !getHearingTestResult().hasEdits()
        && !getSopessExaminationResult().hasEdits()
        && !getDevelopmentScreeningResult().hasEdits();
  }
}
