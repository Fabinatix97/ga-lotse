/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.persistence.db;

import de.eshg.domain.model.BaseEntityWithExternalId;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import de.eshg.lib.procedure.domain.model.ManualProgressEntry;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.time.LocalDate;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Entity
@Table(indexes = @Index(columnList = "procedure_id"))
public class ProofSubmission extends BaseEntityWithExternalId {

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  @Column(nullable = false)
  private SubmissionResult submissionResult;

  @DataSensitivity(SensitivityLevel.PROTECTED)
  @Column(nullable = false)
  private LocalDate submissionDate;

  @DataSensitivity(SensitivityLevel.PROTECTED)
  private LocalDate medicalAttestDeadline;

  @DataSensitivity(SensitivityLevel.PROTECTED)
  @OneToOne(fetch = FetchType.LAZY)
  private ManualProgressEntry manualProgressEntry;

  public SubmissionResult getSubmissionResult() {
    return submissionResult;
  }

  public void setSubmissionResult(SubmissionResult submissionResult) {
    this.submissionResult = submissionResult;
  }

  public LocalDate getSubmissionDate() {
    return submissionDate;
  }

  public void setSubmissionDate(LocalDate submissionDate) {
    this.submissionDate = submissionDate;
  }

  public LocalDate getMedicalAttestDeadline() {
    return medicalAttestDeadline;
  }

  public void setMedicalAttestDeadline(LocalDate medicalAttestDeadline) {
    this.medicalAttestDeadline = medicalAttestDeadline;
  }

  public ManualProgressEntry getManualProgressEntry() {
    return manualProgressEntry;
  }

  public void setManualProgressEntry(ManualProgressEntry manualProgressEntry) {
    this.manualProgressEntry = manualProgressEntry;
  }
}
