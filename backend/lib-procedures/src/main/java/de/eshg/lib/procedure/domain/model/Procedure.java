/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.domain.model;

import static de.eshg.lib.procedure.domain.factory.SystemProgressEntryFactory.createSystemProgressEntry;
import static de.eshg.lib.procedure.domain.model.BasicSystemProgressEntryType.CLOSED;
import static de.eshg.lib.procedure.domain.model.BasicSystemProgressEntryType.CREATED;
import static de.eshg.lib.procedure.domain.model.BasicSystemProgressEntryType.REOPENED;

import de.eshg.domain.model.SequencedBaseEntityWithExternalId;
import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import de.eshg.rest.service.security.CurrentUserHelper;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import java.time.Clock;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import org.hibernate.annotations.BatchSize;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.util.Assert;

@MappedSuperclass
@EntityListeners({AuditingEntityListener.class, ProcedureEntityListener.class})
public abstract class Procedure<
        SELF extends Procedure<SELF, TaskT, RelatedPersonT, FacilityT>,
        TaskT extends Task<SELF>,
        RelatedPersonT extends RelatedPerson<SELF>,
        FacilityT extends RelatedFacility<SELF>>
    extends SequencedBaseEntityWithExternalId {

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @OneToMany(mappedBy = "procedure", cascade = CascadeType.PERSIST, orphanRemoval = true)
  @OrderBy
  @BatchSize(size = 100)
  private final List<TaskT> tasks = new ArrayList<>();

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @OneToMany(mappedBy = "procedure", cascade = CascadeType.PERSIST, orphanRemoval = true)
  @OrderBy
  @BatchSize(size = 100)
  private final List<RelatedPersonT> relatedPersons = new ArrayList<>();

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @OneToMany(mappedBy = "procedure", cascade = CascadeType.PERSIST, orphanRemoval = true)
  @OrderBy
  @BatchSize(size = 100)
  private final List<FacilityT> relatedFacilities = new ArrayList<>();

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @OneToMany(cascade = CascadeType.PERSIST, orphanRemoval = true)
  @JoinColumn(nullable = false, name = ProgressEntry_.PROCEDURE_ID)
  @OrderBy
  @BatchSize(size = 100)
  private final List<ProgressEntry> progressEntries = new ArrayList<>();

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  @Column(nullable = false)
  private ProcedureStatus procedureStatus;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  @Column(nullable = false)
  private ProcedureType procedureType;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Column(nullable = false)
  // Note: No @CreatedDate here as we set it using ProcedureEntityListener
  // which allows to set the created timestamp manually
  private Instant createdAt;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Column(nullable = false)
  @LastModifiedDate
  private Instant modifiedAt;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Column
  private Instant closedAt;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  private Instant exportedAt;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  @Column(nullable = false)
  private ArchivingRelevance archivingRelevance;

  protected Procedure() {
    this(CREATED);
  }

  protected Procedure(TriggerType triggerType) {
    this(CREATED, triggerType);
  }

  protected Procedure(BasicSystemProgressEntryType initializationDescription) {
    this(initializationDescription, TriggerType.EMPLOYEE);
  }

  protected Procedure(
      BasicSystemProgressEntryType initializationDescription, TriggerType triggerType) {
    Assert.notNull(initializationDescription, "InitializationDescription must not be null");
    Assert.isTrue(
        initializationDescription.isCreated(), "InitializationDescription must be a creating type");

    this.progressEntries.add(createSystemProgressEntry(initializationDescription, triggerType));
    this.archivingRelevance = ArchivingRelevance.DEFAULT;
  }

  public ProcedureStatus getProcedureStatus() {
    return procedureStatus;
  }

  public void updateProcedureStatus(
      ProcedureStatus procedureStatus, Clock clock, AuditLogger auditLogger) {
    if (Objects.equals(this.procedureStatus, procedureStatus)) {
      return;
    }

    validateStatusTransition(procedureStatus);

    if (isReopened(procedureStatus)) {
      this.closedAt = null;
      addProgressEntry(createSystemProgressEntry(REOPENED, TriggerType.EMPLOYEE));
      auditLogger.log(
          "Vorgangsbearbeitung",
          "Wiedereröffnung Vorgang",
          Map.of(
              "ID des Vorgangs",
              getExternalId().toString(),
              "Wiedereröffnet durch",
              CurrentUserHelper.getCurrentUserId().toString()));
    }

    if (isClosed(procedureStatus)) {
      this.closedAt = Instant.now(clock);
      addProgressEntry(createSystemProgressEntry(CLOSED, TriggerType.EMPLOYEE));
    }

    this.procedureStatus = procedureStatus;
  }

  private void validateStatusTransition(ProcedureStatus procedureStatus) {
    if (this.procedureStatus != null
        && this.procedureStatus != ProcedureStatus.DRAFT
        && procedureStatus == ProcedureStatus.DRAFT) {
      throw new IllegalArgumentException(
          "Status transition from '%s' to '%s' is not allowed"
              .formatted(this.procedureStatus, ProcedureStatus.DRAFT));
    }
  }

  private boolean isReopened(ProcedureStatus procedureStatus) {
    return ProcedureStatus.isClosed(this.procedureStatus)
        && ProcedureStatus.isOpen(procedureStatus);
  }

  private boolean isClosed(ProcedureStatus procedureStatus) {
    return (this.procedureStatus == null || ProcedureStatus.isOpen(this.procedureStatus))
        && ProcedureStatus.isClosed(procedureStatus);
  }

  public ProcedureType getProcedureType() {
    return procedureType;
  }

  public void setProcedureType(ProcedureType procedureType) {
    this.procedureType = procedureType;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(Instant createdAt) {
    this.createdAt = createdAt;
  }

  public Instant getModifiedAt() {
    return modifiedAt;
  }

  public void setModifiedAt(Instant modifiedAt) {
    this.modifiedAt = modifiedAt;
  }

  public Instant getClosedAt() {
    return closedAt;
  }

  public void setClosedAt(Instant closedAt) {
    this.closedAt = closedAt;
  }

  public Instant getExportedAt() {
    return exportedAt;
  }

  public void setExportedAt(Instant exportedAt) {
    this.exportedAt = exportedAt;
  }

  public List<TaskT> getTasks() {
    return tasks;
  }

  public void addTask(TaskT task) {
    getTasks().add(task);
    task.setProcedure(getSelf());
  }

  public List<RelatedPersonT> getRelatedPersons() {
    return relatedPersons;
  }

  public void addRelatedPerson(RelatedPersonT relatedPerson) {
    getRelatedPersons().add(relatedPerson);
    relatedPerson.setProcedure(getSelf());
  }

  public List<FacilityT> getRelatedFacilities() {
    return relatedFacilities;
  }

  public void addRelatedFacility(FacilityT relatedFacility) {
    getRelatedFacilities().add(relatedFacility);
    relatedFacility.setProcedure(getSelf());
  }

  @SuppressWarnings("unchecked")
  private SELF getSelf() {
    return (SELF) this;
  }

  public void addProgressEntry(ProgressEntry progressEntry) {
    if (progressEntry == null) {
      return;
    }

    getProgressEntries().add(progressEntry);
  }

  public List<ProgressEntry> getProgressEntries() {
    return progressEntries;
  }

  public ArchivingRelevance getArchivingRelevance() {
    return archivingRelevance;
  }

  public void setArchivingRelevance(ArchivingRelevance archivingRelevance) {
    this.archivingRelevance = archivingRelevance;
  }
}
