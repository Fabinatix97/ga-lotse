/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.notification.persistence.repository;

import de.eshg.base.notification.persistence.entity.AbsenceNotification;
import de.eshg.lib.notification.domain.repository.NotificationRepository;

public interface AbsenceNotificationRepository
    extends NotificationRepository<AbsenceNotification> {}
