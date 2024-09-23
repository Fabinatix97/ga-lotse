/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.progressentry;

import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.lib.notification.domain.repository.NotificationRepository;
import de.eshg.lib.procedure.domain.model.ManualProgressEntry;
import de.eshg.lib.procedure.domain.model.ManualProgressEntryDeletionApprovalRequest;
import de.eshg.lib.procedure.domain.model.ManualProgressEntryDeletionApprovalRequestNotification;
import de.eshg.lib.procedure.file.NotificationAwareDeletionApprovalRequestDecisionHandler;
import jakarta.persistence.EntityManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class ManualProgressEntryDeletionApprovalRequestHandler
    extends NotificationAwareDeletionApprovalRequestDecisionHandler<
        ManualProgressEntryDeletionApprovalRequest,
        ManualProgressEntryDeletionApprovalRequestNotification> {

  private static final Logger logger =
      LoggerFactory.getLogger(ManualProgressEntryDeletionApprovalRequestHandler.class);
  private final ProgressEntryService<?> progressEntryService;

  public ManualProgressEntryDeletionApprovalRequestHandler(
      EntityManager entityManager,
      AuditLogger auditLogger,
      NotificationRepository<ManualProgressEntryDeletionApprovalRequestNotification>
          notificationRepository,
      ProgressEntryService<?> progressEntryService) {
    super(entityManager, auditLogger, notificationRepository);
    this.progressEntryService = progressEntryService;
  }

  @Override
  protected void deleteEntity(ManualProgressEntryDeletionApprovalRequest approvalRequest) {
    ManualProgressEntry manualProgressEntry = approvalRequest.getEntity();
    logger.debug("Deleting ManualProgressEntry {}", manualProgressEntry.getExternalId());
    progressEntryService.removeProgressEntry(manualProgressEntry);
  }

  @Override
  protected Class<ManualProgressEntryDeletionApprovalRequest> getHandledType() {
    return ManualProgressEntryDeletionApprovalRequest.class;
  }

  @Override
  protected String getHumanReadableEntityType() {
    return "Verlaufseintrag";
  }
}
