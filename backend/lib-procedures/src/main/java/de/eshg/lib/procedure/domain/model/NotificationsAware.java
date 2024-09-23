/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.domain.model;

import de.eshg.lib.notification.domain.model.Notification;
import java.util.List;

public interface NotificationsAware<T extends Notification> {

  List<T> getNotifications();
}
