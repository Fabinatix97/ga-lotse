/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.progressentry;

import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.lib.foureyes.approval.AbstractDeletionApprovalRequestDecisionHandler;
import de.eshg.lib.procedure.domain.model.ManualProgressEntry;
import de.eshg.lib.procedure.domain.model.ManualProgressEntryDeletionApprovalRequest;
import jakarta.persistence.EntityManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class ManualProgressEntryDeletionApprovalRequestHandler
    extends AbstractDeletionApprovalRequestDecisionHandler<
        ManualProgressEntryDeletionApprovalRequest> {

  private static final Logger logger =
      LoggerFactory.getLogger(ManualProgressEntryDeletionApprovalRequestHandler.class);
  private final ProgressEntryService<?> progressEntryService;

  public ManualProgressEntryDeletionApprovalRequestHandler(
      EntityManager entityManager,
      AuditLogger auditLogger,
      ProgressEntryService<?> progressEntryService) {
    super(entityManager, auditLogger);
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
