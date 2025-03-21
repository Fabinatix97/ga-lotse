/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.notification;

import de.eshg.config.EshgConfigurationService;
import de.eshg.persistence.TransactionHelper;
import de.eshg.travelmedicine.notification.persistence.entity.NotificationConfig;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Service;

@Service
public class NotificationConfigService extends EshgConfigurationService<NotificationConfig> {
  private final InitialNotificationConfig initialNotificationConfig;

  protected NotificationConfigService(
      EntityManager entityManager,
      TransactionHelper transactionHelper,
      InitialNotificationConfig initialNotificationConfig) {
    super(entityManager, transactionHelper, NotificationConfig.class);
    this.initialNotificationConfig = initialNotificationConfig;
  }

  @Override
  public NotificationConfig getConfig() {
    return super.getConfig();
  }

  @Override
  protected NotificationConfig getInitialConfiguration() {
    NotificationConfig notificationConfig = new NotificationConfig();
    notificationConfig.setFromAddress(initialNotificationConfig.fromAddress());
    notificationConfig.setGreeting(initialNotificationConfig.greeting());
    return notificationConfig;
  }
}
