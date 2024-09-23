/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.notification.spring.config;

import de.eshg.lib.notification.NotificationController;
import de.eshg.lib.notification.SimpleNotificationService;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.AutoConfigureAfter;
import org.springframework.boot.autoconfigure.data.jpa.JpaRepositoriesAutoConfiguration;
import org.springframework.context.annotation.Import;

@AutoConfiguration
@AutoConfigureAfter(JpaRepositoriesAutoConfiguration.class)
@Import({
  NotificationController.class,
  SimpleNotificationService.class,
  NotificationLibraryInternalSecurityConfig.class
})
public class NotificationLibraryAutoConfiguration {}
