/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.file;

import de.eshg.lib.auditlog.AuditLogger;
import de.eshg.lib.foureyes.approval.AbstractDeletionApprovalRequestDecisionHandler;
import de.eshg.lib.foureyes.domain.model.DeletionApprovalRequest;
import de.eshg.lib.notification.domain.model.Notification;
import de.eshg.lib.notification.domain.repository.NotificationRepository;
import de.eshg.lib.procedure.domain.model.NotificationsAware;
import jakarta.persistence.EntityManager;

public abstract class NotificationAwareDeletionApprovalRequestDecisionHandler<
        T extends DeletionApprovalRequest<?> & NotificationsAware<N>, N extends Notification>
    extends AbstractDeletionApprovalRequestDecisionHandler<T> {

  protected final NotificationRepository<N> notificationRepository;

  protected NotificationAwareDeletionApprovalRequestDecisionHandler(
      EntityManager entityManager,
      AuditLogger auditLogger,
      NotificationRepository<N> notificationRepository) {
    super(entityManager, auditLogger);
    this.notificationRepository = notificationRepository;
  }

  @Override
  protected final void grant(T approvalRequest) {
    deleteNotifications(approvalRequest);
    super.grant(approvalRequest);
  }

  @Override
  protected final void deny(T approvalRequest) {
    deleteNotifications(approvalRequest);
    super.deny(approvalRequest);
  }

  private void deleteNotifications(T approvalRequest) {
    notificationRepository.deleteAllInBatch(approvalRequest.getNotifications());
    approvalRequest.getNotifications().clear();
  }
}
