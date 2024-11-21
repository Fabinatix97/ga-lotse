/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.security.config;

import static org.springframework.http.HttpMethod.GET;

import de.eshg.lib.keycloak.CitizenPermissionRole;
import de.eshg.lib.keycloak.EmployeePermissionRole;
import de.eshg.lib.keycloak.ModuleLeaderRole;
import org.springframework.stereotype.Component;

@Component
public final class SchoolEntryPublicSecurityConfig extends AbstractPublicSecurityConfiguration {
  SchoolEntryPublicSecurityConfig() {
    super("school-entry");

    grantAccessToLibAppointmentBlockUrls(EmployeePermissionRole.SCHOOL_ENTRY_ADMIN, false);
    grantAccessToStatistics();
    grantAccessToLibProceduresUrls(
        EmployeePermissionRole.SCHOOL_ENTRY_ADMIN, ModuleLeaderRole.SCHOOL_ENTRY_LEADER);

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

    requestMatchers(
            BaseUrls.SchoolEntry.SCHOOL_ENTRY_CONTROLLER + "/**",
            BaseUrls.SchoolEntry.LABEL_CONTROLLER + "/**",
            BaseUrls.SchoolEntry.ICD_10_CODE_CONTROLLER + "/**",
            BaseUrls.SchoolEntry.IMPORT_CONTROLLER + "/**",
            BaseUrls.EVENT_METADATA_API + "/**")
        .hasRole(EmployeePermissionRole.SCHOOL_ENTRY_ADMIN);
  }
}
