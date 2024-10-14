/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.security.config;

import de.eshg.lib.keycloak.EmployeePermissionRole;
import de.eshg.lib.keycloak.ModuleLeaderRole;
import org.springframework.stereotype.Component;

@Component
public final class StiProtectionPublicSecurityConfig extends AbstractPublicSecurityConfiguration {
  StiProtectionPublicSecurityConfig() {
    super("sti-protection");

    grantAccessToLibAppointmentBlockUrls(EmployeePermissionRole.STI_PROTECTION_USER, true);
    grantAccessToLibProceduresUrls(
        EmployeePermissionRole.STI_PROTECTION_USER, ModuleLeaderRole.STI_PROTECTION_LEADER);

    requestMatchers(
            BaseUrls.StiProtection.PROCEDURE_CONTROLLER + "/**",
            BaseUrls.EVENT_METADATA_API + "/**")
        .hasAnyRole(EmployeePermissionRole.STI_PROTECTION_USER);
  }
}
