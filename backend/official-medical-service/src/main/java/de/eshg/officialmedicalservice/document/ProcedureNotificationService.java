/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.document;

import de.eshg.lib.common.BusinessModule;
import de.eshg.lib.notification.AbstractNotificationService;
import de.eshg.lib.notification.api.AbstractNotificationDto;
import de.eshg.officialmedicalservice.document.persistence.entity.ProcedureNotification;
import de.eshg.officialmedicalservice.document.persistence.entity.ProcedureNotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProcedureNotificationService
    extends AbstractNotificationService<ProcedureNotification> {

  protected ProcedureNotificationService(
      ProcedureNotificationRepository notificationRepository,
      @Autowired(required = false) BusinessModule businessModule) {
    super(notificationRepository, businessModule);
  }

  @Override
  protected AbstractNotificationDto toInterface(ProcedureNotification notification) {
    return ProcedureNotificationMapper.mapNotificationToApi(notification, businessModule);
  }
}
