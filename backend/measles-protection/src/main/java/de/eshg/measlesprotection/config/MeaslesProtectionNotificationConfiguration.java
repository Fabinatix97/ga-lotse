/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.config;

import static de.eshg.lib.notification.spring.config.NotificationLibraryInternalSecurityConfig.NOTIFICATION_ACCESS_ROLE;

import de.eshg.lib.keycloak.EmployeePermissionRole;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MeaslesProtectionNotificationConfiguration {

  @Bean(name = NOTIFICATION_ACCESS_ROLE)
  EmployeePermissionRole notificationAccessRole() {
    return EmployeePermissionRole.MEASLES_PROTECTION_ADMIN;
  }
}
