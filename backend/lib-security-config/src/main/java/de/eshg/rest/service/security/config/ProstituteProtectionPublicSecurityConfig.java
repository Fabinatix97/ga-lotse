/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.security.config;

import de.eshg.lib.keycloak.EmployeePermissionRole;
import de.eshg.lib.keycloak.ModuleLeaderRole;
import org.springframework.stereotype.Component;

@Component
public final class ProstituteProtectionPublicSecurityConfig
    extends AbstractPublicSecurityConfiguration {
  ProstituteProtectionPublicSecurityConfig() {
    super("prostitute-protection");

    grantAccessToLibProceduresUrls(
        EmployeePermissionRole.PROSTITUTE_PROTECTION_ADMIN,
        ModuleLeaderRole.PROSTITUTE_PROTECTION_LEADER);
    grantAccessToLibAppointmentBlockUrls(EmployeePermissionRole.PROSTITUTE_PROTECTION_ADMIN);
    grantAccessToConfiguration();
    grantAccessToStatistics(EmployeePermissionRole.PROSTITUTE_PROTECTION_ADMIN);

    requestMatchers(BaseUrls.ProstituteProtection.PROCEDURE_CONTROLLER + "/**")
        .hasAnyRole(EmployeePermissionRole.PROSTITUTE_PROTECTION_ADMIN);
    requestMatchers(BaseUrls.ProstituteProtection.PUBLIC_CITIZEN_CONTROLLER + "/**").permitAll();
  }
}
