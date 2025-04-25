/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.notification;

import de.eshg.base.util.MapUtils;
import de.eshg.config.ConfigurationStatus;
import de.eshg.config.EshgConfigurationService;
import de.eshg.persistence.TransactionHelper;
import de.eshg.travelmedicine.config.GetNotificationConfigResponse;
import de.eshg.travelmedicine.config.NotificationConfigDto;
import de.eshg.travelmedicine.notification.persistence.entity.NotificationConfig;
import jakarta.persistence.EntityManager;
import java.util.SequencedMap;
import org.springframework.stereotype.Service;

@Service
public class NotificationConfigService extends EshgConfigurationService<NotificationConfig> {
  private static final String CONFIGURATION_ENDPOINT = "NOTIFICATION";
  private final InitialNotificationConfig initialNotificationConfig;

  protected NotificationConfigService(
      EntityManager entityManager,
      TransactionHelper transactionHelper,
      InitialNotificationConfig initialNotificationConfig) {
    super(entityManager, transactionHelper, NotificationConfig.class);
    this.initialNotificationConfig = initialNotificationConfig;
  }

  public GetNotificationConfigResponse getNotificationConfig() {
    NotificationConfig config = getConfig();
    if (config.isInitialized()) {
      return new GetNotificationConfigResponse(
          new NotificationConfigDto(config.getFromAddress(), config.getGreeting()));
    } else {
      return new GetNotificationConfigResponse(null);
    }
  }

  public void updateNotificationConfig(NotificationConfigDto notificationConfigDto) {
    NotificationConfig config = getConfig();
    config.setInitialized(true);
    config.setGreeting(notificationConfigDto.greeting());
    config.setFromAddress(notificationConfigDto.fromAddress());
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

  @Override
  protected SequencedMap<String, ConfigurationStatus> getConfigurationStatus() {
    return MapUtils.orderedMapOf(
        CONFIGURATION_ENDPOINT,
        getConfig().isInitialized()
            ? ConfigurationStatus.COMPLETE
            : ConfigurationStatus.INCOMPLETE);
  }

  // VisibleForTesting
  public void setNotInitialized() {
    getConfig().setInitialized(false);
  }
}
