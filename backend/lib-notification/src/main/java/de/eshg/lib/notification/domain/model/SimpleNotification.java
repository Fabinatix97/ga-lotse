/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.notification.domain.model;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import java.util.UUID;

@Entity
public class SimpleNotification extends Notification {

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  @Column(nullable = false)
  private String message;

  @DataSensitivity(SensitivityLevel.SENSITIVE)
  @Column(nullable = false)
  private String title;

  protected SimpleNotification() {
    // for JPA
  }

  public SimpleNotification(UUID recipientUserId, String title, String message) {
    this.recipientUserId = recipientUserId;
    this.title = title;
    this.message = message;
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
}
