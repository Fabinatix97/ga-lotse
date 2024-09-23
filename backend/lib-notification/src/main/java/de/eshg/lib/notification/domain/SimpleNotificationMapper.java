/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.notification.domain;

import de.eshg.lib.common.BusinessModule;
import de.eshg.lib.notification.api.SimpleNotificationDto;
import de.eshg.lib.notification.domain.model.SimpleNotification;

public class SimpleNotificationMapper {
  private SimpleNotificationMapper() {}

  public static SimpleNotificationDto mapNotificationToApi(
      SimpleNotification notification, BusinessModule businessModule) {
    return new SimpleNotificationDto(
        notification.getExternalId(),
        notification.getCreatedAt(),
        notification.getReadAt(),
        businessModule,
        notification.getTitle(),
        notification.getMessage());
  }
}
