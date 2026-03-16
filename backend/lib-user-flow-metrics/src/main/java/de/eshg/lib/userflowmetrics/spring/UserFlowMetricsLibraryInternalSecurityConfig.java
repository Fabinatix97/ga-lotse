/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.userflowmetrics.spring;

import de.eshg.lib.keycloak.EmployeePermissionRole;
import de.eshg.lib.userflowmetrics.api.UserFlowMetricsApi;
import de.eshg.rest.service.security.AuthorizationCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class UserFlowMetricsLibraryInternalSecurityConfig {
  @Bean
  public AuthorizationCustomizer userFlowMetricsAuthorizationCustomizer() {
    return auth ->
        auth.requestMatchers(UserFlowMetricsApi.BASE_URL + "/**")
            .hasRole(EmployeePermissionRole.BASE_PROCEDURE_METRICS_READ.name());
  }
}
