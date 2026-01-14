/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.auditlog;

import static de.eshg.rest.service.security.config.BaseUrls.AuditLog.AUDIT_LOG_CONTROLLER;

import de.eshg.lib.keycloak.EmployeePermissionRole;
import de.eshg.rest.service.security.AuthorizationCustomizer;
import de.eshg.rest.service.security.config.AuditlogPublicSecurityConfig;
import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpMethod;

@Configuration
@Import(AuditlogPublicSecurityConfig.class)
public class AuditLogInternalSecurityConfiguration {

  @Bean
  public AuthorizationCustomizer procedureAuthorizationCustomizer() {
    return auth -> {
      auth.requestMatchers(HttpMethod.POST, AUDIT_LOG_CONTROLLER)
          .hasRole(EmployeePermissionRole.AUDITLOG_FILE_SEND.name());
      auth.requestMatchers(
              HttpMethod.GET,
              "/actuator/health",
              "/actuator/health/liveness",
              "/actuator/health/readiness")
          .permitAll();
      auth.requestMatchers(HttpMethod.GET, "/actuator/prometheus").permitAll();
    };
  }

  @Bean
  @ConditionalOnTestHelperEnabled
  public AuthorizationCustomizer testHelperAuthorizationCustomizer() {
    return auth ->
        auth.requestMatchers(HttpMethod.DELETE, AuditLogServiceTestHelperApi.BASE_URL + "/**")
            .permitAll();
  }
}
