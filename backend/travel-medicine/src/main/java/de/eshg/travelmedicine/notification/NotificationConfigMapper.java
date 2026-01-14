/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.notification;

import de.eshg.travelmedicine.config.NotificationConfigDto;
import de.eshg.travelmedicine.notification.persistence.entity.NotificationConfig;

public class NotificationConfigMapper {

  private NotificationConfigMapper() {}

  public static NotificationConfig mapToDomain(NotificationConfigDto notificationConfigDto) {
    NotificationConfig notificationConfig = new NotificationConfig();
    notificationConfig.setGreeting(notificationConfigDto.greeting());
    notificationConfig.setFromAddress(notificationConfigDto.fromAddress());
    return notificationConfig;
  }

  public static NotificationConfigDto mapToDto(NotificationConfig notificationConfig) {
    if (notificationConfig == null) {
      return null;
    } else {
      return new NotificationConfigDto(
          notificationConfig.getFromAddress(), notificationConfig.getGreeting());
    }
  }
}
