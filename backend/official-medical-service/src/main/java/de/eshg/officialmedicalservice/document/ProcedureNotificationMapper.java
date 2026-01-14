/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.document;

import de.eshg.lib.common.BusinessModule;
import de.eshg.lib.notification.api.ProcedureNotificationDto;
import de.eshg.officialmedicalservice.document.persistence.entity.ProcedureNotification;

public class ProcedureNotificationMapper {
  private ProcedureNotificationMapper() {}

  public static ProcedureNotificationDto mapNotificationToApi(
      ProcedureNotification notification, BusinessModule businessModule) {
    return new ProcedureNotificationDto(
        notification.getExternalId(),
        notification.getCreatedAt(),
        notification.getReadAt(),
        businessModule,
        notification.getTitle(),
        notification.getMessage(),
        notification.getProcedureId());
  }
}
