/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.notification;

import static de.eshg.travelmedicine.notification.NotifcationConfigAuditLogMapper.getRelevantFieldsForLogging;

import de.eshg.base.util.MapUtils;
import de.eshg.config.AuditLogWriter;
import de.eshg.config.ConfigurationStatus;
import de.eshg.config.EshgConfigurationService;
import de.eshg.persistence.TransactionHelper;
import de.eshg.travelmedicine.notification.persistence.entity.NotificationConfig;
import jakarta.persistence.EntityManager;
import java.util.SequencedMap;
import org.springframework.stereotype.Service;

@Service
public class NotificationConfigService extends EshgConfigurationService<NotificationConfig> {
  private static final String CONFIGURATION_ENDPOINT = "NOTIFICATION";
  private final InitialNotificationConfig initialNotificationConfig;
  private final AuditLogWriter auditLogWriter;

  protected NotificationConfigService(
      EntityManager entityManager,
      TransactionHelper transactionHelper,
      AuditLogWriter auditLogWriter,
      InitialNotificationConfig initialNotificationConfig) {
    super(entityManager, transactionHelper, NotificationConfig.class);
    this.initialNotificationConfig = initialNotificationConfig;
    this.auditLogWriter = auditLogWriter;
  }

  public NotificationConfig getNotificationConfig() {
    NotificationConfig config = getConfig();
    if (config.isInitialized()) {
      return config;
    } else {
      return null;
    }
  }

  public void updateNotificationConfig(NotificationConfig notificationConfigUpdate) {
    NotificationConfig persistentConfig = getConfig();
    persistentConfig.setInitialized(true);
    auditLogWriter.writeChangeToAuditLog(
        "notificationConfig",
        getRelevantFieldsForLogging(persistentConfig),
        getRelevantFieldsForLogging(notificationConfigUpdate));
    persistentConfig.setGreeting(notificationConfigUpdate.getGreeting());
    persistentConfig.setFromAddress(notificationConfigUpdate.getFromAddress());
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
  public SequencedMap<String, ConfigurationStatus> getConfigurationStatus() {
    return MapUtils.orderedMapOf(
        CONFIGURATION_ENDPOINT,
        getConfig().isInitialized()
            ? ConfigurationStatus.COMPLETE
            : ConfigurationStatus.INCOMPLETE);
  }
}
