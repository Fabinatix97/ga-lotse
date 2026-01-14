/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.config;

import de.eshg.lib.keycloak.EmployeePermissionRole;
import de.eshg.rest.service.security.AuthorizationCustomizer;
import de.eshg.rest.service.security.config.BaseUrls.SchoolEntry;
import de.eshg.schoolentry.VaccinatedFileStatesController;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;

@Configuration
public class SchoolEntryInternalSecurityConfig {
  @Bean
  public AuthorizationCustomizer schoolEntryAuthorizationCustomizer() {
    return auth ->
        auth.requestMatchers(HttpMethod.POST, SchoolEntry.VACCINATION_CHECK)
            .hasRole(EmployeePermissionRole.SCHOOL_ENTRY_VACCINATION_CHECK.name())
            .requestMatchers(HttpMethod.GET, VaccinatedFileStatesController.BASE_URL)
            .hasRole(EmployeePermissionRole.SCHOOL_ENTRY_VACCINATED_FILE_STATES.name());
  }
}
