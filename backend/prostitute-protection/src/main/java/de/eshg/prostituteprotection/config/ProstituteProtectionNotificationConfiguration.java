/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.prostituteprotection.config;

import static de.eshg.lib.notification.spring.config.NotificationLibraryInternalSecurityConfig.NOTIFICATION_ACCESS_ROLE;

import de.eshg.lib.keycloak.EmployeePermissionRole;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration(proxyBeanMethods = false)
public class ProstituteProtectionNotificationConfiguration {

  @Bean(name = NOTIFICATION_ACCESS_ROLE)
  EmployeePermissionRole notificationAccessRole() {
    return EmployeePermissionRole.PROSTITUTE_PROTECTION_ADMIN;
  }
}
