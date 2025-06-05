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
public final class MedsAbroadPublicSecurityConfig extends AbstractPublicSecurityConfiguration {
  MedsAbroadPublicSecurityConfig() {
    super("meds-abroad");

    grantAccessToLibAppointmentBlockUrls(EmployeePermissionRole.MEDS_ABROAD_ADMIN, true);
    grantAccessToLibProceduresUrls(
        EmployeePermissionRole.MEDS_ABROAD_ADMIN, ModuleLeaderRole.MEDS_ABROAD_LEADER);
    grantAccessToConfiguration();
    grantAccessToStatistics(EmployeePermissionRole.MEDS_ABROAD_ADMIN);

    requestMatchers(PUT, BaseUrls.MedsAbroad.PROCEDURE_CONTROLLER + "/{id}/reopen")
        .hasRole(EmployeePermissionRole.MEDS_ABROAD_LEADER);
    requestMatchers(GET, BaseUrls.MedsAbroad.PROCEDURE_CONTROLLER + "/{id}/**")
        .hasAnyRole(
            EmployeePermissionRole.MEDS_ABROAD_ADMIN, EmployeePermissionRole.PROCEDURE_ARCHIVE);
    requestMatchers(
            BaseUrls.MedsAbroad.PROCEDURE_CONTROLLER + "/**", BaseUrls.EVENT_METADATA_API + "/**")
        .hasAnyRole(EmployeePermissionRole.MEDS_ABROAD_ADMIN);
  }
}
