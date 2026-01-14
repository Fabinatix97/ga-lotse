/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.notification;

import de.eshg.lib.notification.api.GetNotificationsResponse;
import de.eshg.lib.notification.api.MarkNotificationsAsReadRequest;
import io.swagger.v3.oas.annotations.Hidden;
import java.time.Clock;
import java.time.Instant;
import java.util.Collection;
import java.util.List;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.RestController;

@Hidden
@RestController
public class NotificationController implements NotificationApi {
  private final List<NotificationService> notificationServices;
  private final Clock clock;

  public NotificationController(List<NotificationService> notificationServices, Clock clock) {
    Assert.state(
        !notificationServices.isEmpty(),
        NotificationController.class.getSimpleName()
            + " requires at least one notification service");
    this.notificationServices = notificationServices;
    this.clock = clock;
  }

  @Transactional(readOnly = true)
  @Override
  public GetNotificationsResponse getNotifications() {
    return new GetNotificationsResponse(
        notificationServices.stream()
            .map(NotificationService::getNotificationsForCurrentUser)
            .flatMap(Collection::stream)
            .toList());
  }

  @Transactional(readOnly = true)
  @Override
  public GetNotificationsResponse getUnreadNotifications() {
    return new GetNotificationsResponse(
        notificationServices.stream()
            .map(NotificationService::getUnreadNotificationsForCurrentUser)
            .flatMap(Collection::stream)
            .toList());
  }

  @Transactional
  @Override
  public void markNotificationsAsRead(
      MarkNotificationsAsReadRequest markNotificationsAsReadRequest) {
    Instant now = Instant.now(clock);
    for (NotificationService notificationService : notificationServices) {
      notificationService.markNotificationsAsRead(
          markNotificationsAsReadRequest.notificationIds(), now);
    }
  }
}
