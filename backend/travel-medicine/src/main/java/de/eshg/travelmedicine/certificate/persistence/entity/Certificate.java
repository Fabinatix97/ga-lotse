/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.certificate.persistence.entity;

import de.eshg.domain.model.GloballyUniqueEntityBase;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.ProcedureStep;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.UUID;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@DataSensitivity(SensitivityLevel.PUBLIC)
@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(indexes = @Index(columnList = "procedure_step_id"))
public class Certificate extends GloballyUniqueEntityBase {

  @NotNull
  @JdbcType(PostgreSQLEnumJdbcType.class)
  @Column
  private CertificateType certificateType;

  @ManyToOne(optional = false, fetch = FetchType.LAZY)
  @JoinColumn(name = "procedure_step_id")
  private ProcedureStep procedureStep;

  @NotNull @Column private UUID progressEntryId;

  @NotNull @Column @CreatedDate private Instant createdAt;

  @NotNull @Column @LastModifiedDate private Instant modifiedAt;

  public Certificate() {}

  public Certificate(
      CertificateType certificateType, ProcedureStep procedureStep, UUID progressEntryId) {
    this.certificateType = certificateType;
    this.procedureStep = procedureStep;
    this.progressEntryId = progressEntryId;
  }

  public @NotNull CertificateType getCertificateType() {
    return certificateType;
  }

  public void setCertificateType(@NotNull CertificateType certificateType) {
    this.certificateType = certificateType;
  }

  public ProcedureStep getProcedureStep() {
    return procedureStep;
  }

  public void setProcedureStep(@NotNull ProcedureStep procedureStep) {
    this.procedureStep = procedureStep;
  }

  public @NotNull UUID getProgressEntryId() {
    return progressEntryId;
  }

  public void setProgressEntryId(@NotNull UUID progressEntryId) {
    this.progressEntryId = progressEntryId;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public Instant getModifiedAt() {
    return modifiedAt;
  }
}
