/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.notification;

import de.eshg.lib.notification.api.AbstractNotificationDto;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface NotificationService {

  List<AbstractNotificationDto> getNotificationsForCurrentUser();

  List<AbstractNotificationDto> getUnreadNotificationsForCurrentUser();

  void markNotificationsAsRead(List<UUID> notificationIds, Instant now);
}
