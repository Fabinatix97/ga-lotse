/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.notification.spring.config;

import de.eshg.lib.keycloak.EmployeePermissionRole;
import de.eshg.lib.notification.NotificationApi;
import de.eshg.rest.service.security.AuthorizationCustomizer;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class NotificationLibraryInternalSecurityConfig {
  public static final String NOTIFICATION_ACCESS_ROLE = "notificationAccessRole";

  @Bean
  public AuthorizationCustomizer notificationAuthorizationCustomizer(
      @Qualifier(NOTIFICATION_ACCESS_ROLE) EmployeePermissionRole notificationAccessRole) {

    return auth ->
        auth.requestMatchers(NotificationApi.BASE_URL + "/**")
            .hasRole(notificationAccessRole.name());
  }
}
