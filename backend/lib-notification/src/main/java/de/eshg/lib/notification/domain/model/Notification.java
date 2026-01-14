/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.notification.domain.model;

import de.eshg.domain.model.BaseEntityWithExternalId;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import java.time.Instant;
import java.util.UUID;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class Notification extends BaseEntityWithExternalId {

  @DataSensitivity(SensitivityLevel.PROTECTED)
  @Column(nullable = false)
  protected UUID recipientUserId;

  @DataSensitivity(SensitivityLevel.PROTECTED)
  @CreatedDate
  @Column(nullable = false)
  private Instant createdAt;

  @DataSensitivity(SensitivityLevel.PROTECTED)
  @CreatedBy
  @Column(nullable = false)
  private UUID createdByUserId;

  @DataSensitivity(SensitivityLevel.PROTECTED)
  @Column
  private Instant readAt;

  public Instant getCreatedAt() {
    return createdAt;
  }

  public UUID getRecipientUserId() {
    return recipientUserId;
  }

  public void setRecipientUserId(UUID recipientUserId) {
    this.recipientUserId = recipientUserId;
  }

  public UUID getCreatedByUserId() {
    return createdByUserId;
  }

  public Instant getReadAt() {
    return readAt;
  }

  public void setReadAt(Instant readAt) {
    this.readAt = readAt;
  }
}
