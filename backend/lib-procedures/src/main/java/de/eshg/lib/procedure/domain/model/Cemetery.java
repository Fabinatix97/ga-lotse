/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.domain.model;

import de.eshg.domain.model.SequencedBaseEntity;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import java.time.Instant;
import java.util.UUID;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@EntityListeners(AuditingEntityListener.class)
public class Cemetery extends SequencedBaseEntity {

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Column(nullable = false)
  @CreatedDate
  private Instant createdAt;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Column(nullable = false)
  private String type;

  @DataSensitivity(SensitivityLevel.PROTECTED)
  @Column(nullable = false)
  private Long formerId;

  @DataSensitivity(SensitivityLevel.PROTECTED)
  @Column
  private UUID formerExternalId;

  @DataSensitivity(SensitivityLevel.HIGHLY_SENSITIVE)
  @Column(nullable = false)
  @JdbcTypeCode(SqlTypes.JSON)
  private String content;

  public Instant getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(Instant createdAt) {
    this.createdAt = createdAt;
  }

  public String getType() {
    return type;
  }

  public void setType(String type) {
    this.type = type;
  }

  public Long getFormerId() {
    return formerId;
  }

  public void setFormerId(Long formerId) {
    this.formerId = formerId;
  }

  public UUID getFormerExternalId() {
    return formerExternalId;
  }

  public void setFormerExternalId(UUID formerExternalId) {
    this.formerExternalId = formerExternalId;
  }

  public String getContent() {
    return content;
  }

  public void setContent(String content) {
    this.content = content;
  }
}
