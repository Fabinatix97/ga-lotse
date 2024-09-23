/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.notification;

import de.eshg.lib.common.BusinessModule;
import de.eshg.lib.notification.api.AbstractNotificationDto;
import de.eshg.lib.notification.domain.SimpleNotificationMapper;
import de.eshg.lib.notification.domain.model.SimpleNotification;
import de.eshg.lib.notification.domain.repository.SimpleNotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.stereotype.Service;

@Service
@ConditionalOnMissingBean(SimpleNotificationService.class)
public class SimpleNotificationService extends AbstractNotificationService<SimpleNotification> {

  protected SimpleNotificationService(
      SimpleNotificationRepository notificationRepository,
      @Autowired(required = false) BusinessModule businessModule) {
    super(notificationRepository, businessModule);
  }

  @Override
  protected AbstractNotificationDto toInterface(SimpleNotification notification) {
    return SimpleNotificationMapper.mapNotificationToApi(notification, businessModule);
  }
}
