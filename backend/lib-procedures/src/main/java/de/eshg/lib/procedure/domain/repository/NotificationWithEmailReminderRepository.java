/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.domain.repository;

import de.eshg.lib.notification.domain.repository.NotificationRepository;
import de.eshg.lib.procedure.domain.model.NotificationWithEmailReminder;
import jakarta.persistence.LockModeType;
import java.time.Instant;
import java.util.List;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.query.Param;

@NoRepositoryBean
public interface NotificationWithEmailReminderRepository<T extends NotificationWithEmailReminder>
    extends NotificationRepository<T> {

  @Lock(LockModeType.PESSIMISTIC_WRITE)
  @Query(
      """
        SELECT notification FROM #{#entityName} notification
        WHERE notification.mailSent is null
        AND notification.readAt is null
        AND notification.createdAt <= :maxCreatedAt
        """)
  List<T> findAllRelevantForMailSendingThatWereCreatedBefore(
      @Param("maxCreatedAt") Instant maxCreatedAt);
}
