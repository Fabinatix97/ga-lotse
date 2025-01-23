/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry.config;

import static de.eshg.lib.notification.spring.config.NotificationLibraryInternalSecurityConfig.NOTIFICATION_ACCESS_ROLE;

import de.eshg.lib.keycloak.EmployeePermissionRole;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MedicalRegistryNotificationConfiguration {

  @Bean(name = NOTIFICATION_ACCESS_ROLE)
  EmployeePermissionRole notificationAccessRole() {
    return EmployeePermissionRole.MEDICAL_REGISTRY_ADMIN;
  }
}
