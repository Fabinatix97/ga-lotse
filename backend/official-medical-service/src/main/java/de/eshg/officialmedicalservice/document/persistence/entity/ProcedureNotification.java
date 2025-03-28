/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.document.persistence.entity;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import de.eshg.lib.notification.domain.model.Notification;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import java.util.UUID;

@Entity
public class ProcedureNotification extends Notification {

  @DataSensitivity(SensitivityLevel.PROTECTED)
  @Column(nullable = false)
  private String title;

  @DataSensitivity(SensitivityLevel.PROTECTED)
  @Column(nullable = false)
  private String message;

  @DataSensitivity(SensitivityLevel.PROTECTED)
  @Column(nullable = false)
  private UUID procedureId;

  public ProcedureNotification() {}

  public ProcedureNotification(
      UUID recipientUserId, String title, String message, UUID procedureId) {
    this.recipientUserId = recipientUserId;
    this.title = title;
    this.message = message;
    this.procedureId = procedureId;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getMessage() {
    return message;
  }

  public void setMessage(String message) {
    this.message = message;
  }

  public UUID getProcedureId() {
    return procedureId;
  }

  public void setProcedureId(UUID procedureId) {
    this.procedureId = procedureId;
  }
}
