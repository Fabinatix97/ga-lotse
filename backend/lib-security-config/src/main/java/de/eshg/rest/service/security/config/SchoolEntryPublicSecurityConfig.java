/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.security.config;

import de.eshg.lib.keycloak.CitizenPermissionRole;
import de.eshg.lib.keycloak.EmployeePermissionRole;
import de.eshg.lib.keycloak.ModuleLeaderRole;
import org.springframework.stereotype.Component;

@Component
public final class SchoolEntryPublicSecurityConfig extends AbstractPublicSecurityConfiguration {
  SchoolEntryPublicSecurityConfig() {
    super("school-entry");

    grantAccessToLibAppointmentBlockUrls(EmployeePermissionRole.SCHOOL_ENTRY_ADMIN);
    grantAccessToStatistics();
    grantAccessToLibProceduresUrls(
        EmployeePermissionRole.SCHOOL_ENTRY_ADMIN, ModuleLeaderRole.SCHOOL_ENTRY_LEADER);

    // TODO: Check if this rule is ok. Maybe a new Controller could be introduced for public
    // school-entry endpoints?
    requestMatchers(BaseUrls.SchoolEntry.SCHOOL_ENTRY_CITIZEN_CONTROLLER + "/documents/**")
        .permitAll();

    requestMatchers(BaseUrls.SchoolEntry.SCHOOL_ENTRY_CITIZEN_CONTROLLER + "/**")
        .hasRole(CitizenPermissionRole.ACCESS_CODE_USER);

    requestMatchers(
            BaseUrls.SchoolEntry.FEATURE_TOGGLES_CONTROLLER + "/**",
            BaseUrls.SchoolEntry.CONFIG_CONTROLLER + "/**")
        .hasRole(EmployeePermissionRole.STANDARD_EMPLOYEE);

    requestMatchers(
            BaseUrls.SchoolEntry.SCHOOL_ENTRY_CONTROLLER + "/**",
            BaseUrls.SchoolEntry.VALUE_EVALUATOR_CONTROLLER + "/**",
            BaseUrls.SchoolEntry.LABEL_CONTROLLER + "/**",
            BaseUrls.SchoolEntry.COUNTRY_CODES_CONTROLLER + "/**",
            BaseUrls.EVENT_METADATA_API + "/**")
        .hasRole(EmployeePermissionRole.SCHOOL_ENTRY_ADMIN);
  }
}
