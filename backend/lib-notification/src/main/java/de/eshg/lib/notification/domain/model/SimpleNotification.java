/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.notification.domain.model;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import java.time.Instant;
import java.util.UUID;

@Entity
public class SimpleNotification extends Notification {

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  @Column(nullable = false)
  private String message;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  @Column(nullable = false)
  private String title;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Column(nullable = false, columnDefinition = "boolean default false")
  private boolean mailToSentFlag;

  @DataSensitivity(SensitivityLevel.PROTECTED)
  private Instant mailSentAt;

  protected SimpleNotification() {
    // for JPA
  }

  public SimpleNotification(UUID recipientUserId, String title, String message) {
    this.recipientUserId = recipientUserId;
    this.title = title;
    this.message = message;
    this.mailToSentFlag = false;
  }

  public String getMessage() {
    return message;
  }

  public void setMessage(String message) {
    this.message = message;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public boolean getMailToSentFlag() {
    return mailToSentFlag;
  }

  public void setMailToSentFlag(boolean mailToSentFlag) {
    this.mailToSentFlag = mailToSentFlag;
  }

  public Instant getMailSentAt() {
    return mailSentAt;
  }

  public void setMailSentAt(Instant mailSentAt) {
    this.mailSentAt = mailSentAt;
  }
}
