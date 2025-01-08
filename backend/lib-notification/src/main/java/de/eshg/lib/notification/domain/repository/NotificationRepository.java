/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.notification.domain.repository;

import de.eshg.lib.notification.domain.model.Notification;
import java.time.Instant;
import java.util.Collection;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.NoRepositoryBean;

@NoRepositoryBean
public interface NotificationRepository<N extends Notification>
    extends JpaRepository<N, Long>, JpaSpecificationExecutor<N> {

  List<N> findByRecipientUserIdAndReadAtIsNullOrderById(UUID recipientUserId);

  List<N> findByRecipientUserIdOrderById(UUID recipientUserId);

  List<N> findByRecipientUserIdAndExternalIdInAndReadAtIsNull(
      UUID recipientUserId, Collection<UUID> externalIds);

  long deleteByReadAtNullAndCreatedAtLessThan(Instant createdAtLimit);

  long deleteByReadAtNotNullAndCreatedAtLessThan(Instant createdAtLimit);
}
