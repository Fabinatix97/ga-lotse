/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.persistence.db;

import de.eshg.domain.model.BaseEntityWithExternalId;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import de.eshg.lib.procedure.domain.model.Pdf;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Table(indexes = @Index(columnList = "procedure_id"))
@EntityListeners(AuditingEntityListener.class)
public class ProofRequestLetter extends BaseEntityWithExternalId {

  @DataSensitivity(SensitivityLevel.PROTECTED)
  @ManyToOne(optional = false, fetch = FetchType.LAZY)
  @JoinColumn(name = "procedure_id")
  private MeaslesProtectionProcedure procedure;

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  private LetterType letterType;

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private UUID recipientId;

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @CreatedBy
  private UUID senderId;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Column(nullable = false)
  @CreatedDate
  private Instant createdAt;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Column(nullable = false)
  private LocalDate deadline;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  @OneToOne(optional = false, cascade = CascadeType.PERSIST, fetch = FetchType.LAZY)
  private Pdf pdf;

  public void setProcedure(MeaslesProtectionProcedure procedure) {
    this.procedure = procedure;
  }

  public LetterType getLetterType() {
    return letterType;
  }

  public void setLetterType(LetterType letterType) {
    this.letterType = letterType;
  }

  public UUID getRecipientId() {
    return recipientId;
  }

  public void setRecipientId(UUID receiverId) {
    this.recipientId = receiverId;
  }

  public UUID getSenderId() {
    return senderId;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public LocalDate getDeadline() {
    return deadline;
  }

  public void setDeadline(LocalDate deadline) {
    this.deadline = deadline;
  }

  public Pdf getPdf() {
    return pdf;
  }

  public void setPdf(Pdf pdf) {
    this.pdf = pdf;
  }
}
