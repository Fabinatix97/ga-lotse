/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.file;

import de.eshg.lib.common.BusinessModule;
import de.eshg.lib.notification.AbstractNotificationService;
import de.eshg.lib.notification.api.AbstractNotificationDto;
import de.eshg.lib.notification.api.FileDeletionApprovalRequestNotificationDto;
import de.eshg.lib.notification.domain.repository.NotificationRepository;
import de.eshg.lib.procedure.domain.model.File;
import de.eshg.lib.procedure.domain.model.FileDeletionApprovalRequestNotification;
import de.eshg.lib.procedure.domain.repository.ProcedureRepository;
import java.util.Optional;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FileDeletionApprovalRequestNotificationService
    extends AbstractNotificationService<FileDeletionApprovalRequestNotification> {

  private final ProcedureRepository<?> procedureRepository;

  protected FileDeletionApprovalRequestNotificationService(
      NotificationRepository<FileDeletionApprovalRequestNotification> notificationRepository,
      @Autowired(required = false) BusinessModule businessModule,
      ProcedureRepository<?> procedureRepository) {
    super(notificationRepository, businessModule);
    this.procedureRepository = procedureRepository;
  }

  @Override
  protected AbstractNotificationDto toInterface(
      FileDeletionApprovalRequestNotification notification) {
    File file = notification.getApprovalRequest().getFile();
    UUID fileId = file.getExternalId();

    Optional<UUID> procedureId = procedureRepository.findExternalIdByFileExternalId(fileId);
    UUID resolvedProcedureId =
        procedureId.orElseThrow(
            () ->
                new IllegalStateException(
                    "Either procedureId or inboxProcedureId should be present"));
    return new FileDeletionApprovalRequestNotificationDto(
        notification.getExternalId(),
        notification.getCreatedAt(),
        notification.getReadAt(),
        this.businessModule,
        notification.getCreatedByUserId(),
        resolvedProcedureId,
        file.getFileName());
  }
}
