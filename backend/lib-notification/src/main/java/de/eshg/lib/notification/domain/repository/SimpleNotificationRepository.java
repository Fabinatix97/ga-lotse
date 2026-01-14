/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.notification.domain.repository;

import de.eshg.lib.notification.domain.model.SimpleNotification;
import jakarta.persistence.LockModeType;
import java.time.Instant;
import java.util.List;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SimpleNotificationRepository extends NotificationRepository<SimpleNotification> {

  @Lock(LockModeType.PESSIMISTIC_WRITE)
  @Query(
      """
      SELECT notification FROM #{#entityName} notification
      WHERE notification.mailToSentFlag is true
      AND notification.readAt is null
      AND notification.createdAt <= :maxCreatedAt
      """)
  List<SimpleNotification> findAllRelevantForMailSendingThatWereCreatedBefore(
      @Param("maxCreatedAt") Instant maxCreatedAt);
}
