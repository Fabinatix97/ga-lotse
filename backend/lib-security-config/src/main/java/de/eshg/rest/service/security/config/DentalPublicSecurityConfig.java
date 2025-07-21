/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.security.config;

import static org.springframework.http.HttpMethod.GET;
import static org.springframework.http.HttpMethod.POST;
import static org.springframework.http.HttpMethod.PUT;

import de.eshg.lib.keycloak.EmployeePermissionRole;
import de.eshg.lib.keycloak.ModuleLeaderRole;
import org.springframework.stereotype.Component;

@Component
public final class DentalPublicSecurityConfig extends AbstractPublicSecurityConfiguration {
  DentalPublicSecurityConfig() {
    super("dental");

    grantAccessToLibProceduresUrls(
        EmployeePermissionRole.DENTAL_ADMIN, ModuleLeaderRole.DENTAL_LEADER);
    grantAccessToStatistics(EmployeePermissionRole.DENTAL_ADMIN);

    requestMatchers(GET, BaseUrls.Dental.PROCEDURE_LABEL_CONTROLLER + "/**")
        .hasAnyRole(EmployeePermissionRole.DENTAL_ADMIN, EmployeePermissionRole.DENTAL_LEADER);
    requestMatchers(POST, BaseUrls.Dental.PROCEDURE_LABEL_CONTROLLER + "/**")
        .hasRole(EmployeePermissionRole.DENTAL_LEADER);
    requestMatchers(PUT, BaseUrls.Dental.PROCEDURE_LABEL_CONTROLLER + "/**")
        .hasRole(EmployeePermissionRole.DENTAL_LEADER);

    requestMatchers(
            BaseUrls.Dental.CHILD_CONTROLLER + "/**",
            BaseUrls.Dental.PROPHYLAXIS_SESSION_CONTROLLER + "/**")
        .hasRole(EmployeePermissionRole.DENTAL_ADMIN);
  }
}
