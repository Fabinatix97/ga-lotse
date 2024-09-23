/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.foureyes.domain.model;

import de.eshg.domain.model.BaseEntityWithExternalId;
import de.eshg.domain.model.EntityWithExternalId;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import java.time.Clock;
import java.time.Instant;
import java.util.UUID;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@EntityListeners(AuditingEntityListener.class)
public abstract class ApprovalRequest<E extends EntityWithExternalId>
    extends BaseEntityWithExternalId {

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @CreatedDate
  @Column(nullable = false)
  private Instant createdAt;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @CreatedBy
  @Column(nullable = false)
  private UUID createdBy;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  @Column(nullable = false)
  private String reason;

  @DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
  private UUID decidedBy;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  private Instant decidedAt;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @JdbcType(PostgreSQLEnumJdbcType.class)
  private Decision decision;

  public Instant getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(Instant createdAt) {
    this.createdAt = createdAt;
  }

  public UUID getCreatedBy() {
    return createdBy;
  }

  public void setCreatedBy(UUID createdBy) {
    this.createdBy = createdBy;
  }

  public String getReason() {
    return reason;
  }

  public void setReason(String reason) {
    this.reason = reason;
  }

  public UUID getDecidedBy() {
    return decidedBy;
  }

  public Instant getDecidedAt() {
    return decidedAt;
  }

  public Decision getDecision() {
    return decision;
  }

  public abstract E getEntity();

  public abstract Operation getOperation();

  public ApprovalRequestStatus getStatus() {
    if (decision != null) {
      return ApprovalRequestStatus.CLOSED;
    } else {
      return ApprovalRequestStatus.OPEN;
    }
  }

  public void decide(Decision decision, UUID decidedBy, Clock clock) {
    this.decision = decision;
    this.decidedBy = decidedBy;
    this.decidedAt = Instant.now(clock);
  }
}
