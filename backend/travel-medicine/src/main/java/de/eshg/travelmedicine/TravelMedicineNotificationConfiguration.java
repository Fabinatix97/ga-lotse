/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine;

import static de.eshg.lib.notification.spring.config.NotificationLibraryInternalSecurityConfig.NOTIFICATION_ACCESS_ROLE;

import de.eshg.lib.keycloak.EmployeePermissionRole;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class TravelMedicineNotificationConfiguration {

  @Bean(name = NOTIFICATION_ACCESS_ROLE)
  EmployeePermissionRole notificationAccessRole() {
    return EmployeePermissionRole.TRAVEL_MEDICINE_ADMIN;
  }
}
