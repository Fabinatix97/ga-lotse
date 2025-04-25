/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.security.config;

import static org.springframework.http.HttpMethod.GET;

import de.eshg.lib.keycloak.CitizenPermissionRole;
import de.eshg.lib.keycloak.EmployeePermissionRole;
import de.eshg.lib.keycloak.ModuleLeaderRole;
import org.springframework.stereotype.Component;

@Component
public final class StiProtectionPublicSecurityConfig extends AbstractPublicSecurityConfiguration {
  StiProtectionPublicSecurityConfig() {
    super("sti-protection");

    grantAccessToLibAppointmentBlockUrls(EmployeePermissionRole.STI_PROTECTION_ADMIN, true);
    grantAccessToLibProceduresUrls(
        EmployeePermissionRole.STI_PROTECTION_ADMIN, ModuleLeaderRole.STI_PROTECTION_LEADER);
    grantAccessToConfiguration();
    grantAccessToStatistics(EmployeePermissionRole.STI_PROTECTION_ADMIN);

    requestMatchers(BaseUrls.StiProtection.CITIZEN_PUBLIC_CONTROLLER + "/**").permitAll();

    requestMatchers(GET, BaseUrls.StiProtection.PROCEDURE_CONTROLLER + "/{id}/**")
        .hasAnyRole(
            EmployeePermissionRole.STI_PROTECTION_ADMIN, EmployeePermissionRole.PROCEDURE_ARCHIVE);
    requestMatchers(
            BaseUrls.StiProtection.PROCEDURE_CONTROLLER + "/**",
            BaseUrls.EVENT_METADATA_API + "/**")
        .hasAnyRole(EmployeePermissionRole.STI_PROTECTION_ADMIN);

    requestMatchers(BaseUrls.StiProtection.CITIZEN_CONTROLLER + "/**")
        .hasRole(CitizenPermissionRole.ACCESS_CODE_USER);
  }
}
