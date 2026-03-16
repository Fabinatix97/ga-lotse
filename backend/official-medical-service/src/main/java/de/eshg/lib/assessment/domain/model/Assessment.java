/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.lib.assessment.domain.model;

import de.eshg.domain.model.BaseEntityWithExternalId;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import de.eshg.lib.procedure.domain.model.Procedure;
import de.eshg.lib.procedure.domain.model.RelatedFacility;
import de.eshg.lib.procedure.domain.model.RelatedPerson;
import de.eshg.lib.procedure.domain.model.Task;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public class Assessment<
        ProcedureT extends Procedure<ProcedureT, TaskT, PersonT, FacilityT>,
        TaskT extends Task<ProcedureT>,
        PersonT extends RelatedPerson<ProcedureT>,
        FacilityT extends RelatedFacility<ProcedureT>,
        LegalBasisT extends LegalBasis,
        SourceT extends Source>
    extends BaseEntityWithExternalId {

  @ManyToOne(optional = false)
  @JoinColumn(name = "procedure_id")
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private ProcedureT procedure;

  @CreatedDate
  @Column(nullable = false)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private Instant created;

  @Column
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private Instant finished;

  @Column(nullable = false)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private UUID editor;

  @Column(nullable = false)
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private String title;

  @Column
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private String summary;

  @Column
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private String documentContent;

  @Column
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private String documentCache;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  @Column
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  private AssessmentResult assessmentResult;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  @Column(nullable = false)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private AssessmentType assessmentType;

  @JdbcType(PostgreSQLEnumJdbcType.class)
  @Column(nullable = false)
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private AssessmentStatus assessmentStatus;

  @OneToMany
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  @OrderBy
  private final List<SourceT> sources = new ArrayList<>();

  @OneToMany
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  @OrderBy
  private final List<LegalBasisT> legalBases = new ArrayList<>();

  @ElementCollection
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  @OrderBy
  private final List<UUID> previewReader = new ArrayList<>();

  @JdbcType(PostgreSQLEnumJdbcType.class)
  @Column
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private RecipientType recipientType;

  public ProcedureT getProcedure() {
    return procedure;
  }

  public void setProcedure(ProcedureT procedure) {
    this.procedure = procedure;
  }

  public Instant getCreated() {
    return created;
  }

  public void setCreated(Instant created) {
    this.created = created;
  }

  public Instant getFinished() {
    return finished;
  }

  public void setFinished(Instant finished) {
    this.finished = finished;
  }

  public UUID getEditor() {
    return editor;
  }

  public void setEditor(UUID editor) {
    this.editor = editor;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getSummary() {
    return summary;
  }

  public void setSummary(String summary) {
    this.summary = summary;
  }

  public String getDocumentContent() {
    return documentContent;
  }

  public void setDocumentContent(String content) {
    this.documentContent = content;
  }

  public String getDocumentCache() {
    return documentCache;
  }

  public void setDocumentCache(String documentCache) {
    this.documentCache = documentCache;
  }

  public AssessmentResult getAssessmentResult() {
    return assessmentResult;
  }

  public void setAssessmentResult(AssessmentResult assessmentResult) {
    this.assessmentResult = assessmentResult;
  }

  public AssessmentType getAssessmentType() {
    return assessmentType;
  }

  public void setAssessmentType(AssessmentType assessmentType) {
    this.assessmentType = assessmentType;
  }

  public AssessmentStatus getAssessmentStatus() {
    return assessmentStatus;
  }

  public void setAssessmentStatus(AssessmentStatus assessmentStatus) {
    this.assessmentStatus = assessmentStatus;
  }

  public List<SourceT> getSources() {
    return sources;
  }

  public List<LegalBasisT> getLegalBases() {
    return legalBases;
  }

  public List<UUID> getPreviewReader() {
    return previewReader;
  }

  public void setRecipientType(RecipientType recipientType) {
    this.recipientType = recipientType;
  }

  public RecipientType getRecipientType() {
    return recipientType;
  }
}
