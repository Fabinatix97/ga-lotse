/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.notification.spring.config;

import de.eshg.lib.notification.NotificationController;
import de.eshg.lib.notification.NotificationHousekeeping;
import de.eshg.lib.notification.SimpleNotificationService;
import de.eshg.lib.notification.config.NotificationHousekeepingProperties;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.AutoConfigureAfter;
import org.springframework.boot.autoconfigure.data.jpa.JpaRepositoriesAutoConfiguration;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Import;

@AutoConfiguration
@AutoConfigureAfter(JpaRepositoriesAutoConfiguration.class)
@EnableConfigurationProperties(NotificationHousekeepingProperties.class)
@Import({
  NotificationController.class,
  SimpleNotificationService.class,
  NotificationLibraryInternalSecurityConfig.class,
  NotificationHousekeeping.class,
  NotificationLibrarySchedulingConfig.class
})
public class NotificationLibraryAutoConfiguration {}
