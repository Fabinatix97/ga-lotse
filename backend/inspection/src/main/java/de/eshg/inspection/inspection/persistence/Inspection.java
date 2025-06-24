/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.inspection.persistence;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import de.eshg.inspection.checklist.persistence.Checklist;
import de.eshg.inspection.checklist.persistence.Checklist_;
import de.eshg.inspection.facility.persistence.Facility;
import de.eshg.inspection.incident.persistence.InspectionIncident;
import de.eshg.inspection.incident.persistence.InspectionIncident_;
import de.eshg.inspection.inspection.InspectionValidator;
import de.eshg.inspection.inspection.api.FollowupType;
import de.eshg.inspection.inspection.api.InspectionPhase;
import de.eshg.inspection.inspection.api.InspectionResult;
import de.eshg.inspection.inspection.api.InspectionType;
import de.eshg.inspection.packlist.persistence.Packlist;
import de.eshg.inspection.packlist.persistence.Packlist_;
import de.eshg.inspection.report.persistence.Report;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import de.eshg.lib.procedure.domain.model.Procedure;
import de.eshg.lib.procedure.domain.model.TaskType;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorCode;
import de.eshg.rest.service.security.CurrentUserHelper;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Entity
@JsonIgnoreProperties({"precedingInspection", "followupInspection"})
public class Inspection
    extends Procedure<Inspection, InspectionTask, InspectionPerson, InspectionRelatedFacility> {

  @Column(nullable = false)
  @NotNull
  @JdbcType(PostgreSQLEnumJdbcType.class)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private InspectionType type = InspectionType.REGULAR;

  @Column
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private UUID modifiedBy;

  @Column
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private UUID lockedBy;

  @Column
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private Instant lockedAt;

  @Column(nullable = false)
  @NotNull
  @JdbcType(PostgreSQLEnumJdbcType.class)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private InspectionPhase phase = InspectionPhase.NEW;

  @Column(nullable = false)
  @NotNull
  @JdbcType(PostgreSQLEnumJdbcType.class)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private InspectionResult result = InspectionResult.OPEN;

  @Column(nullable = false)
  @ColumnDefault("false")
  @NotNull
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private boolean challenging;

  @OneToMany(
      mappedBy = InspectionInventory_.INSPECTION,
      cascade = {CascadeType.PERSIST, CascadeType.REMOVE},
      orphanRemoval = true)
  @OrderBy
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private final List<InspectionInventory> inventories = new ArrayList<>();

  @OneToMany(
      mappedBy = InspectionResource_.INSPECTION,
      cascade = {CascadeType.PERSIST, CascadeType.REMOVE},
      orphanRemoval = true)
  @OrderBy
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private final List<InspectionResource> resources = new ArrayList<>();

  @OneToMany(
      mappedBy = InspectionIncident_.INSPECTION,
      cascade = {CascadeType.PERSIST, CascadeType.REMOVE},
      orphanRemoval = true)
  @OrderBy
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private final List<InspectionIncident> incidents = new ArrayList<>();

  @NotNull
  @OneToMany(
      fetch = FetchType.LAZY,
      mappedBy = Checklist_.INSPECTION,
      cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE},
      orphanRemoval = true)
  @OrderBy(Checklist_.POSITION)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private final List<Checklist> checklists = new ArrayList<>();

  @NotNull
  @OneToMany(
      fetch = FetchType.LAZY,
      mappedBy = Packlist_.INSPECTION,
      cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE},
      orphanRemoval = true)
  @OrderBy(Packlist_.POSITION)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private final List<Packlist> packlists = new ArrayList<>();

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private String notes;

  @OneToOne(
      cascade = {CascadeType.PERSIST, CascadeType.REMOVE},
      orphanRemoval = true)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private InspectionAppointment plannedAppointment;

  @OneToOne(
      cascade = {CascadeType.PERSIST, CascadeType.REMOVE},
      orphanRemoval = true)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private InspectionAppointment executionAppointment;

  @OneToOne(
      cascade = {CascadeType.PERSIST, CascadeType.REMOVE},
      orphanRemoval = true)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private InspectionTravelTime travelTime;

  @Column(unique = true)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private UUID calendarEventId;

  @OneToOne(
      cascade = {CascadeType.PERSIST, CascadeType.REMOVE},
      orphanRemoval = true)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private InspectionAnnouncement announcement;

  @OneToOne(
      fetch = FetchType.LAZY,
      cascade = {CascadeType.PERSIST, CascadeType.REMOVE},
      orphanRemoval = true)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private Report report;

  @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private Inspection followupInspection;

  @OneToOne(fetch = FetchType.LAZY, mappedBy = Inspection_.FOLLOWUP_INSPECTION)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private Inspection precedingInspection;

  @Column
  @JdbcType(PostgreSQLEnumJdbcType.class)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private FollowupType followupType;

  @Column
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private Instant followupDate;

  @NotNull
  @ManyToMany(fetch = FetchType.LAZY)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  @OrderBy
  @JoinTable(
      name = "inspection_possible_duplicates",
      joinColumns = {@JoinColumn(name = "inspection_id")},
      inverseJoinColumns = {@JoinColumn(name = "duplicate_id")})
  private final List<Inspection> possibleDuplicates = new ArrayList<>();

  @Column
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private Integer fileNumberSuffix;

  public InspectionType getType() {
    return type;
  }

  public void setType(InspectionType type) {
    this.type = type;
  }

  public UUID getModifiedBy() {
    return modifiedBy;
  }

  public void setModifiedBy(UUID modifiedBy) {
    this.modifiedBy = modifiedBy;
  }

  public UUID getLockedBy() {
    return lockedBy;
  }

  public void setLockedBy(UUID lockedBy) {
    this.lockedBy = lockedBy;
  }

  public Instant getLockedAt() {
    return lockedAt;
  }

  public void setLockedAt(Instant lockedAt) {
    this.lockedAt = lockedAt;
  }

  public InspectionPhase getPhase() {
    return phase;
  }

  public void setPhase(InspectionPhase phase) {
    this.phase = phase;
  }

  public InspectionResult getResult() {
    return result;
  }

  public void setResult(InspectionResult result) {
    this.result = result;
  }

  public boolean isChallenging() {
    return challenging;
  }

  public void setChallenging(boolean challenging) {
    this.challenging = challenging;
  }

  public List<InspectionInventory> getInventories() {
    return inventories;
  }

  public List<InspectionResource> getResources() {
    return resources;
  }

  public List<InspectionIncident> getIncidents() {
    return incidents;
  }

  public void addIncident(InspectionIncident incident) {
    incidents.add(incident);
    incident.setInspection(this);
  }

  public void addIncidents(List<InspectionIncident> incidents) {
    for (InspectionIncident incident : incidents) {
      addIncident(incident);
    }
  }

  /**
   * Return the related facility associated with this inspection. An inspection instance always has
   * exactly one fixed related facility, which is assigned during <i>creation</i> of the inspection
   * and doesn't change during the lifetime of the inspection.
   */
  public InspectionRelatedFacility getRelatedFacility() {
    return getRelatedFacilities().getFirst();
  }

  /**
   * Return the centralFileStateId of the facility associated with this inspection. Since an
   * inspection instance is always associated with exactly one related facility, the
   * centralFileStateId always exists.
   */
  public UUID getCentralFileStateId() {
    return getRelatedFacility().getCentralFileStateId();
  }

  /**
   * Return the facility associated with this inspection. Since an inspection instance is always
   * associated with exactly one related facility, this always returns a non-null value.
   */
  public Facility getFacility() {
    return getRelatedFacility().getFacility();
  }

  public Optional<InspectionTask> getPlanningTask() {
    return getTask(TaskType.INSPECTION_PLANNING);
  }

  /**
   * get the INSPECTION_PLANNING task or throw IllegalStateException. Use this if you <i>know for
   * sure</i> that the task exists.
   */
  public InspectionTask getPlanningTaskOrThrow() {
    return getTaskOrThrow(TaskType.INSPECTION_PLANNING);
  }

  public Optional<InspectionTask> getExecutionTask() {
    return getTask(TaskType.INSPECTION_EXECUTION);
  }

  /**
   * get the INSPECTION_EXECUTION task or throw IllegalStateException. Use this if you <i>know for
   * sure</i> that the task exists.
   */
  public InspectionTask getExecutionTaskOrThrow() {
    return getTaskOrThrow(TaskType.INSPECTION_EXECUTION);
  }

  public Optional<InspectionTask> getReportTask() {
    return getTask(TaskType.INSPECTION_REPORT);
  }

  /**
   * get the INSPECTION_REPORT task or throw IllegalStateException. Use this if you <i>know for
   * sure</i> that the task exists.
   */
  public InspectionTask getReportTaskOrThrow() {
    return getTaskOrThrow(TaskType.INSPECTION_REPORT);
  }

  public InspectionAppointment getPlannedAppointment() {
    return plannedAppointment;
  }

  public void setPlannedAppointment(InspectionAppointment plannedAppointment) {
    this.plannedAppointment = plannedAppointment;
  }

  public InspectionAppointment getExecutionAppointment() {
    return executionAppointment;
  }

  public void setExecutionAppointment(InspectionAppointment executionAppointment) {
    this.executionAppointment = executionAppointment;
  }

  public InspectionTravelTime getTravelTime() {
    return travelTime;
  }

  public void setTravelTime(InspectionTravelTime travelTime) {
    this.travelTime = travelTime;
  }

  public UUID getCalendarEventId() {
    return calendarEventId;
  }

  public void setCalendarEventId(UUID calendarEventId) {
    this.calendarEventId = calendarEventId;
  }

  public InspectionTask createPlanningTask(UUID assigneeId, Instant assignmentDate) {
    if (getPlanningTask().isPresent()) {
      throw new IllegalStateException("Task with type PLANNING already created");
    }
    InspectionTask task = InspectionTask.newPlanningTask(assigneeId, assignmentDate);
    addTask(task);
    return task;
  }

  public InspectionTask createExecutionTask(Instant assignmentDate) {
    if (getExecutionTask().isPresent()) {
      throw new IllegalStateException("Task with type EXECUTION already created");
    }
    InspectionTask task =
        InspectionTask.newExecutionTask(
            getPlanningTask()
                .orElseGet(
                    () -> createPlanningTask(CurrentUserHelper.getCurrentUserId(), assignmentDate))
                .getAssigneeId(),
            assignmentDate);
    addTask(task);
    return task;
  }

  public InspectionTask createReportTask(Instant assignmentDate) {
    if (getReportTask().isPresent()) {
      throw new IllegalStateException("Task with type REPORT already created");
    }
    InspectionTask task =
        InspectionTask.newReportTask(
            getPlanningTask()
                .orElseGet(
                    () -> createPlanningTask(CurrentUserHelper.getCurrentUserId(), assignmentDate))
                .getAssigneeId(),
            assignmentDate);
    addTask(task);
    return task;
  }

  public List<Checklist> getChecklists() {
    validateChecklists();
    return checklists;
  }

  public void addChecklists(List<Checklist> checklists) {
    checklists.forEach(
        newChecklist -> {
          newChecklist.setInspection(this);
          this.checklists.add(newChecklist);
        });
  }

  public List<Packlist> getPacklists() {
    return packlists;
  }

  public String getNotes() {
    return notes;
  }

  public void setNotes(String notes) {
    this.notes = notes;
  }

  public InspectionAnnouncement getAnnouncement() {
    return announcement;
  }

  public void setAnnouncement(InspectionAnnouncement announcement) {
    this.announcement = announcement;
  }

  public Report getReport() {
    return report;
  }

  public void setReport(Report report) {
    this.report = report;
  }

  public Inspection getFollowupInspection() {
    return followupInspection;
  }

  public void setFollowupInspection(Inspection followupInspection) {
    this.followupInspection = followupInspection;
  }

  public FollowupType getFollowupType() {
    return followupType;
  }

  public void setFollowupType(FollowupType followupType) {
    this.followupType = followupType;
  }

  public Instant getFollowupDate() {
    return followupDate;
  }

  public void setFollowupDate(Instant followupDate) {
    this.followupDate = followupDate;
  }

  public @NotNull List<Inspection> getPossibleDuplicates() {
    return possibleDuplicates;
  }

  private Optional<InspectionTask> getTask(TaskType taskType) {
    return getTasks().stream()
        .filter(t -> taskType.equals(t.getTaskType()))
        .reduce(
            (a, b) -> {
              throw new IllegalStateException("more than one task of type " + taskType);
            });
  }

  private InspectionTask getTaskOrThrow(TaskType taskType) {
    return getTask(taskType)
        .orElseThrow(
            () ->
                new IllegalStateException(
                    "task " + taskType + " not found because of wrong phase: " + phase));
  }

  private void validateChecklists() {
    if (!InspectionValidator.verifyChecklists(this, checklists)) {
      throw new BadRequestException(
          ErrorCode.CORRUPT, "Checklist validation failed. At least one checklist is corrupt");
    }
  }

  public Inspection getPrecedingInspection() {
    return precedingInspection;
  }

  public void setPrecedingInspection(Inspection precedingInspection) {
    this.precedingInspection = precedingInspection;
  }

  public Integer getFileNumberSuffix() {
    return fileNumberSuffix;
  }

  public void setFileNumberSuffix(Integer fileNumberSuffix) {
    this.fileNumberSuffix = fileNumberSuffix;
  }
}
