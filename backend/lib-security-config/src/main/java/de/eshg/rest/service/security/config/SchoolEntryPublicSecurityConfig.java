/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.security.config;

import static org.springframework.http.HttpMethod.GET;
import static org.springframework.http.HttpMethod.POST;
import static org.springframework.http.HttpMethod.PUT;

import de.eshg.lib.keycloak.CitizenPermissionRole;
import de.eshg.lib.keycloak.EmployeePermissionRole;
import de.eshg.lib.keycloak.ModuleLeaderRole;
import org.springframework.stereotype.Component;

@Component
public final class SchoolEntryPublicSecurityConfig extends AbstractPublicSecurityConfiguration {
  SchoolEntryPublicSecurityConfig() {
    super("school-entry");

    grantAccessToLibAppointmentBlockUrls(EmployeePermissionRole.SCHOOL_ENTRY_ADMIN, false);
    grantAccessToStatistics(EmployeePermissionRole.SCHOOL_ENTRY_ADMIN);
    grantAccessToLibProceduresUrls(
        EmployeePermissionRole.SCHOOL_ENTRY_ADMIN, ModuleLeaderRole.SCHOOL_ENTRY_LEADER);
    grantAccessToConfiguration();

    requestMatchers(GET, BaseUrls.SchoolEntry.PUBLIC_CITIZEN_CONTROLLER + "/**").permitAll();

    requestMatchers(BaseUrls.SchoolEntry.SCHOOL_ENTRY_CITIZEN_CONTROLLER + "/**")
        .hasRole(CitizenPermissionRole.ACCESS_CODE_USER);

    requestMatchers(
            BaseUrls.SchoolEntry.FEATURE_TOGGLES_CONTROLLER + "/**",
            BaseUrls.SchoolEntry.CONFIG_CONTROLLER + "/**")
        .hasRole(EmployeePermissionRole.STANDARD_EMPLOYEE);

    // Allow read-only access to individual procedures including examination results etc.
    // for PROCEDURE_ARCHIVE
    requestMatchers(
            GET,
            BaseUrls.SchoolEntry.SCHOOL_ENTRY_CONTROLLER + "/{procedureId}",
            BaseUrls.SchoolEntry.SCHOOL_ENTRY_CONTROLLER + "/{procedureId}/**",
            BaseUrls.SchoolEntry.VALUE_EVALUATOR_CONTROLLER + "/**",
            BaseUrls.SchoolEntry.COUNTRY_CODES_CONTROLLER + "/**")
        .hasAnyRole(
            EmployeePermissionRole.SCHOOL_ENTRY_ADMIN, EmployeePermissionRole.PROCEDURE_ARCHIVE);

    requestMatchers(GET, BaseUrls.SchoolEntry.PROCEDURE_LABEL_CONTROLLER + "/**")
        .hasAnyRole(
            EmployeePermissionRole.SCHOOL_ENTRY_ADMIN, EmployeePermissionRole.SCHOOL_ENTRY_LEADER);
    requestMatchers(POST, BaseUrls.SchoolEntry.PROCEDURE_LABEL_CONTROLLER + "/**")
        .hasRole(EmployeePermissionRole.SCHOOL_ENTRY_LEADER);
    requestMatchers(PUT, BaseUrls.SchoolEntry.PROCEDURE_LABEL_CONTROLLER + "/**")
        .hasRole(EmployeePermissionRole.SCHOOL_ENTRY_LEADER);

    requestMatchers(
            BaseUrls.SchoolEntry.SCHOOL_ENTRY_CONTROLLER + "/**",
            BaseUrls.SchoolEntry.IMPORT_CONTROLLER + "/**",
            BaseUrls.EVENT_METADATA_API + "/**")
        .hasRole(EmployeePermissionRole.SCHOOL_ENTRY_ADMIN);
  }
}
