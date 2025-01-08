/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.domain.repository;

import de.eshg.lib.procedure.domain.model.FileDeletionApprovalRequestNotification;

public interface FileDeletionApprovalRequestNotificationRepository
    extends NotificationWithEmailReminderRepository<FileDeletionApprovalRequestNotification> {}
