/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.file;

import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.lib.foureyes.approval.AbstractDeletionApprovalRequestDecisionHandler;
import de.eshg.lib.procedure.domain.model.File;
import de.eshg.lib.procedure.domain.model.FileDeletionApprovalRequest;
import jakarta.persistence.EntityManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class FileDeletionRequestApprovalRequestDecisionHandler
    extends AbstractDeletionApprovalRequestDecisionHandler<FileDeletionApprovalRequest> {

  private final Logger logger =
      LoggerFactory.getLogger(FileDeletionRequestApprovalRequestDecisionHandler.class);
  private final FileStorageService fileStorageService;
  private final EntityManager entityManager;

  protected FileDeletionRequestApprovalRequestDecisionHandler(
      EntityManager entityManager, AuditLogger auditLogger, FileStorageService fileStorageService) {
    super(entityManager, auditLogger);
    this.entityManager = entityManager;
    this.fileStorageService = fileStorageService;
  }

  @Override
  protected void deleteEntity(FileDeletionApprovalRequest approvalRequest) {
    File file = approvalRequest.getFile();
    logger.debug("Deleting file {}", file.getExternalId());
    approvalRequest.updateEntity(null);
    entityManager.remove(approvalRequest);
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
