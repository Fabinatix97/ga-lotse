/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.security.config;

import de.eshg.lib.keycloak.EmployeePermissionRole;
import de.eshg.lib.keycloak.ModuleLeaderRole;
import org.springframework.stereotype.Component;

@Component
public final class InfectionBriefingPublicSecurityConfig
    extends AbstractPublicSecurityConfiguration {
  InfectionBriefingPublicSecurityConfig() {
    super("infection-briefing");

    grantAccessToLibProceduresUrls(
        EmployeePermissionRole.INFECTION_BRIEFING_ADMIN,
        ModuleLeaderRole.INFECTION_BRIEFING_LEADER);
    grantAccessToLibAppointmentBlockUrls(EmployeePermissionRole.INFECTION_BRIEFING_ADMIN);
    grantAccessToConfiguration();
    grantAccessToStatistics(EmployeePermissionRole.INFECTION_BRIEFING_ADMIN);

    requestMatchers(
            BaseUrls.InfectionBriefing.PROCEDURE_CONTROLLER + "/**",
            BaseUrls.EVENT_METADATA_API + "/**")
        .hasRole(EmployeePermissionRole.INFECTION_BRIEFING_ADMIN);

    requestMatchers(BaseUrls.InfectionBriefing.PUBLIC_CITIZEN_CONTROLLER + "/**").permitAll();
  }
}
