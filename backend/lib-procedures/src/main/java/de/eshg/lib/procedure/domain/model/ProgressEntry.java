/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.domain.model;

import static jakarta.persistence.InheritanceType.JOINED;

import de.eshg.domain.model.SequencedBaseEntityWithExternalId;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.Inheritance;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.time.Instant;
import org.hibernate.envers.Audited;
import org.hibernate.envers.NotAudited;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Inheritance(strategy = JOINED)
@EntityListeners(AuditingEntityListener.class)
@Audited
@Table(indexes = @Index(columnList = ProgressEntry_.PROCEDURE_ID))
public abstract class ProgressEntry extends SequencedBaseEntityWithExternalId implements FileAware {

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Column(nullable = false)
  @CreatedDate
  private Instant createdAt;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Column(nullable = false)
  @LastModifiedDate
  private Instant modifiedAt;

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @OneToOne(cascade = CascadeType.PERSIST, orphanRemoval = true, fetch = FetchType.LAZY)
  @NotAudited
  private File file;

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  @Column(insertable = false, updatable = false, nullable = false)
  private Long procedureId;

  public Instant getCreatedAt() {
    return createdAt;
  }

  public Instant getModifiedAt() {
    return modifiedAt;
  }

  @Override
  public File getFile() {
    return file;
  }

  @Override
  public void setFile(File file) {
    this.file = file;
  }

  public Long getProcedureId() {
    return procedureId;
  }

  public void setProcedureId(Long procedureId) {
    this.procedureId = procedureId;
  }
}
