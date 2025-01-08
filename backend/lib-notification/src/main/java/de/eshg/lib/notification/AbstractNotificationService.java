/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.notification;

import de.eshg.lib.common.BusinessModule;
import de.eshg.lib.notification.api.AbstractNotificationDto;
import de.eshg.lib.notification.domain.model.Notification;
import de.eshg.lib.notification.domain.repository.NotificationRepository;
import de.eshg.rest.service.security.CurrentUserHelper;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

public abstract class AbstractNotificationService<N extends Notification>
    implements NotificationService {
  private final NotificationRepository<N> notificationRepository;
  protected final BusinessModule businessModule;

  protected AbstractNotificationService(
      NotificationRepository<N> notificationRepository,
      @Autowired(required = false) BusinessModule businessModule) {
    this.notificationRepository = notificationRepository;
    this.businessModule = businessModule;
  }

  @Override
  public List<AbstractNotificationDto> getNotificationsForCurrentUser() {
    return notificationRepository.findByRecipientUserIdOrderById(getCurrentUserId()).stream()
        .map(this::toInterface)
        .toList();
  }

  @Override
  public List<AbstractNotificationDto> getUnreadNotificationsForCurrentUser() {
    return notificationRepository
        .findByRecipientUserIdAndReadAtIsNullOrderById(getCurrentUserId())
        .stream()
        .map(this::toInterface)
        .toList();
  }

  protected abstract AbstractNotificationDto toInterface(N notification);

  @Override
  public void markNotificationsAsRead(List<UUID> notificationIds, Instant now) {
    notificationRepository
        .findByRecipientUserIdAndExternalIdInAndReadAtIsNull(getCurrentUserId(), notificationIds)
        .forEach(notification -> notification.setReadAt(now));
  }

  @Transactional
  public N addNotification(N notification) {
    return notificationRepository.save(notification);
  }

  public UUID getCurrentUserId() {
    return CurrentUserHelper.getCurrentUserId();
  }
}
