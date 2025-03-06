/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.statistics.spring.config;

import static org.springframework.http.HttpMethod.GET;
import static org.springframework.http.HttpMethod.POST;

import de.eshg.lib.keycloak.EmployeePermissionRole;
import de.eshg.rest.service.security.AuthorizationCustomizer;
import de.eshg.rest.service.security.config.BaseUrls;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class StatisticsLibraryInternalSecurityConfig {

  @Bean
  public AuthorizationCustomizer statisticsAuthorizationCustomizer() {
    return auth -> {
      auth.requestMatchers(GET, BaseUrls.STATISTICS + "/**")
          .hasAnyRole(
              EmployeePermissionRole.STATISTICS_STATISTICS_READ.name(),
              EmployeePermissionRole.STATISTICS_STATISTICS_WRITE.name());
      auth.requestMatchers(POST, BaseUrls.STATISTICS + "/data-table-header/**")
          .hasRole(EmployeePermissionRole.STATISTICS_STATISTICS_WRITE.name());
      auth.requestMatchers(POST, BaseUrls.STATISTICS + "/specific-data/**")
          .hasRole(EmployeePermissionRole.STATISTICS_STATISTICS_TECHNICAL_USER.name());
    };
  }
}
