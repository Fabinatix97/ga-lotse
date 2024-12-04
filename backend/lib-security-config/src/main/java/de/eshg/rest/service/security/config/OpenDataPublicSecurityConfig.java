/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.security.config;

import de.eshg.lib.keycloak.EmployeePermissionRole;
import de.eshg.rest.service.security.config.BaseUrls.OpenData;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;

@Component
public final class OpenDataPublicSecurityConfig extends AbstractPublicSecurityConfiguration {
  OpenDataPublicSecurityConfig() {
    super("opendata");

    requestMatchers(HttpMethod.GET, BaseUrls.OpenData.OPEN_DATA_CONTROLLER)
        .hasRole(EmployeePermissionRole.OPEN_DATA_ADMIN);
    requestMatchers(HttpMethod.GET, BaseUrls.OpenData.OPEN_DATA_CONTROLLER + "/search/**")
        .hasRole(EmployeePermissionRole.OPEN_DATA_ADMIN);
    requestMatchers(HttpMethod.GET, BaseUrls.OpenData.OPEN_DATA_CONTROLLER + "/*/download")
        .hasRole(EmployeePermissionRole.OPEN_DATA_ADMIN);
    requestMatchers(HttpMethod.PUT, BaseUrls.OpenData.OPEN_DATA_CONTROLLER + "/**")
        .hasRole(EmployeePermissionRole.OPEN_DATA_ADMIN);
    requestMatchers(HttpMethod.DELETE, BaseUrls.OpenData.OPEN_DATA_CONTROLLER + "/**")
        .hasRole(EmployeePermissionRole.OPEN_DATA_ADMIN);
    requestMatchers(HttpMethod.GET, BaseUrls.OpenData.OPEN_DATA_CONTROLLER + "/**")
        .hasRole(EmployeePermissionRole.OPEN_DATA_ADMIN);
    requestMatchers(HttpMethod.POST, BaseUrls.OpenData.OPEN_DATA_CONTROLLER)
        .hasRole(EmployeePermissionRole.OPEN_DATA_ADMIN);

    requestMatchers(HttpMethod.GET, OpenData.PUBLIC_CITIZEN_CONTROLLER + "/**").permitAll();
  }
}
