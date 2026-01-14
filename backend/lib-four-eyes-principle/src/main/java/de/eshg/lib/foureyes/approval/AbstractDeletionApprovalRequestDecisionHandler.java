/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.foureyes.approval;

import de.eshg.domain.model.EntityWithExternalId;
import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.lib.foureyes.domain.model.DeletionApprovalRequest;
import de.eshg.lib.foureyes.domain.model.LockableEntity;
import de.eshg.rest.service.security.CurrentUserHelper;
import jakarta.persistence.EntityManager;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public abstract class AbstractDeletionApprovalRequestDecisionHandler<
        T extends DeletionApprovalRequest<?>>
    extends AbstractApprovalRequestDecisionHandler<T> {

  private static final Logger log =
      LoggerFactory.getLogger(AbstractDeletionApprovalRequestDecisionHandler.class);
  private final EntityManager entityManager;
  private final AuditLogger auditLogger;

  protected AbstractDeletionApprovalRequestDecisionHandler(
      EntityManager entityManager, AuditLogger auditLogger) {
    this.entityManager = entityManager;
    this.auditLogger = auditLogger;
  }

  @Override
  protected void grant(T approvalRequest) {
    log.debug("Granting deletion approval request {}", approvalRequest.getExternalId());
    log(approvalRequest.getEntity(), "Bestätigung einer Löschanfrage");
    LockableEntity entity = approvalRequest.getEntity();
    entity.lock(false);
    deleteEntity(approvalRequest);
  }

  protected void deleteEntity(T approvalRequest) {
    EntityWithExternalId entity = approvalRequest.getEntity();
    log.debug("Deleting entity {} of type {}", entity.getExternalId(), entity.getClass());
    entityManager.remove(entity);
  }

  @Override
  protected void deny(T approvalRequest) {
    log.debug(
        "Denying and consecutively removing deletion approval request {}",
        approvalRequest.getExternalId());
    log(approvalRequest.getEntity(), "Ablehnung einer Löschanfrage");
    approvalRequest.getEntity().lock(false);
    approvalRequest.updateEntity(null);
    entityManager.remove(approvalRequest);
  }

  protected abstract String getHumanReadableEntityType();

  protected void log(EntityWithExternalId entity, String action) {
    auditLogger.log(
        "Freigabeprozess",
        action,
        Map.of(
            "durch Benutzer",
            CurrentUserHelper.getCurrentUserIdAsStringGracefully().orElse("-"),
            "Objekttyp",
            getHumanReadableEntityType(),
            "Externe ID des Objekts",
            entity.getExternalId().toString()));
  }
}
