/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.domain.model;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import de.eshg.lib.notification.domain.model.Notification;
import jakarta.persistence.MappedSuperclass;
import java.time.Instant;

@MappedSuperclass
public abstract class NotificationWithEmailReminder extends Notification {

  @DataSensitivity(SensitivityLevel.PUBLIC)
  private Instant mailSent;

  public Instant getMailSent() {
    return mailSent;
  }

  public void setMailSent(Instant mailSent) {
    this.mailSent = mailSent;
  }
}
