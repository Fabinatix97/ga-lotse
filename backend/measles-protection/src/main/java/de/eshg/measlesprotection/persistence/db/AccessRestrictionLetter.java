/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.persistence.db;

import de.eshg.domain.model.BaseEntityWithExternalId;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import de.eshg.lib.procedure.domain.model.File;
import de.eshg.lib.procedure.domain.model.ProgressEntry;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.util.UUID;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Entity
@Table(indexes = @Index(columnList = "access_restriction_id"))
public class AccessRestrictionLetter extends BaseEntityWithExternalId {

  @ManyToOne(optional = false, fetch = FetchType.LAZY)
  @JoinColumn(name = "access_restriction_id")
  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private AccessRestriction accessRestriction;

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private UUID recipientId;

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private LocalDate sentAt;

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  private LetterStatus letterStatus;

  /** The progress entry containing the pdf letter */
  @DataSensitivity(SensitivityLevel.SENSITIVE)
  @OneToOne(cascade = CascadeType.PERSIST, fetch = FetchType.LAZY)
  private ProgressEntry progressEntry;

  public AccessRestriction getAccessRestriction() {
    return accessRestriction;
  }

  public void setAccessRestriction(AccessRestriction accessRestriction) {
    this.accessRestriction = accessRestriction;
  }

  public UUID getRecipientId() {
    return recipientId;
  }

  public void setRecipientId(UUID recipientId) {
    this.recipientId = recipientId;
  }

  public LocalDate getSentAt() {
    return sentAt;
  }

  public void setSentAt(LocalDate sendAt) {
    this.sentAt = sendAt;
  }

  public LetterStatus getLetterStatus() {
    return letterStatus;
  }

  public void setLetterStatus(LetterStatus letterStatus) {
    this.letterStatus = letterStatus;
  }

  public ProgressEntry getProgressEntry() {
    return progressEntry;
  }

  public void setProgressEntry(ProgressEntry progressEntry) {
    this.progressEntry = progressEntry;
  }

  public UUID getExternalFileId() {
    return this.progressEntry.getFile().getExternalId();
  }

  public File getFile() {
    return this.progressEntry.getFile();
  }
}
