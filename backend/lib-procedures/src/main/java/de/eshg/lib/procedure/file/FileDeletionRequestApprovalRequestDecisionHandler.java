/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.file;

import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.lib.procedure.domain.model.File;
import de.eshg.lib.procedure.domain.model.FileDeletionApprovalRequest;
import de.eshg.lib.procedure.domain.model.FileDeletionApprovalRequestNotification;
import de.eshg.lib.procedure.domain.repository.FileDeletionApprovalRequestNotificationRepository;
import jakarta.persistence.EntityManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class FileDeletionRequestApprovalRequestDecisionHandler
    extends NotificationAwareDeletionApprovalRequestDecisionHandler<
        FileDeletionApprovalRequest, FileDeletionApprovalRequestNotification> {

  private final Logger logger =
      LoggerFactory.getLogger(FileDeletionRequestApprovalRequestDecisionHandler.class);
  private final FileStorageService fileStorageService;

  protected FileDeletionRequestApprovalRequestDecisionHandler(
      EntityManager entityManager,
      AuditLogger auditLogger,
      FileStorageService fileStorageService,
      FileDeletionApprovalRequestNotificationRepository notificationRepository) {
    super(entityManager, auditLogger, notificationRepository);
    this.fileStorageService = fileStorageService;
  }

  @Override
  protected void deleteEntity(FileDeletionApprovalRequest approvalRequest) {
    File file = approvalRequest.getFile();
    logger.debug("Deleting file {}", file.getExternalId());
    fileStorageService.deleteFile(file);
  }

  @Override
  protected Class<FileDeletionApprovalRequest> getHandledType() {
    return FileDeletionApprovalRequest.class;
  }

  @Override
  protected String getHumanReadableEntityType() {
    return "Datei";
  }
}
