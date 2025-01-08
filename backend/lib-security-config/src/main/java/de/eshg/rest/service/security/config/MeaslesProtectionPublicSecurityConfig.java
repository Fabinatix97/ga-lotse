/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.security.config;

import static org.springframework.http.HttpMethod.GET;
import static org.springframework.http.HttpMethod.PUT;

import de.eshg.lib.keycloak.EmployeePermissionRole;
import de.eshg.lib.keycloak.ModuleLeaderRole;
import org.springframework.stereotype.Component;

@Component
public final class MeaslesProtectionPublicSecurityConfig
    extends AbstractPublicSecurityConfiguration {
  MeaslesProtectionPublicSecurityConfig() {
    super("measles-protection");

    grantAccessToLibAppointmentBlockUrls(EmployeePermissionRole.MEASLES_PROTECTION_ADMIN, true);
    grantAccessToLibProceduresUrls(
        EmployeePermissionRole.MEASLES_PROTECTION_ADMIN,
        ModuleLeaderRole.MEASLES_PROTECTION_LEADER);

    requestMatchers(BaseUrls.MeaslesProtection.FEATURE_TOGGLES_CONTROLLER + "/**")
        .hasRole(EmployeePermissionRole.STANDARD_EMPLOYEE);

    requestMatchers(BaseUrls.MeaslesProtection.ORGANISATION_CONTROLLER + "/**").permitAll();

    requestMatchers(PUT, BaseUrls.MeaslesProtection.PROCEDURE_CONTROLLER + "/*/reopen")
        .hasRole(EmployeePermissionRole.MEASLES_PROTECTION_LEADER);
    requestMatchers(GET, BaseUrls.MeaslesProtection.PROCEDURE_CONTROLLER + "/{id}/**")
        .hasAnyRole(
            EmployeePermissionRole.MEASLES_PROTECTION_LEADER,
            EmployeePermissionRole.MEASLES_PROTECTION_ADMIN,
            EmployeePermissionRole.PROCEDURE_ARCHIVE);
    requestMatchers(
            BaseUrls.MeaslesProtection.PROCEDURE_CONTROLLER + "/**",
            BaseUrls.EVENT_METADATA_API + "/**")
        .hasAnyRole(
            EmployeePermissionRole.MEASLES_PROTECTION_LEADER,
            EmployeePermissionRole.MEASLES_PROTECTION_ADMIN);
  }
}
