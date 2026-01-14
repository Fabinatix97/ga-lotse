/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.security.config;

import static org.springframework.http.HttpMethod.*;

import de.eshg.lib.keycloak.EmployeePermissionRole;
import org.springframework.stereotype.Component;

@Component
public final class StatisticsPublicSecurityConfig extends AbstractPublicSecurityConfiguration {

  private static final String OVERVIEW_PATH = "/overview/**";

  StatisticsPublicSecurityConfig() {
    super("statistics");

    requestMatchers(BaseUrls.Statistics.FEATURE_TOGGLES_CONTROLLER + "/**")
        .hasRole(EmployeePermissionRole.STANDARD_EMPLOYEE);

    requestMatchers(POST, BaseUrls.Statistics.ANALYSIS_URL + "/**")
        .hasRole(EmployeePermissionRole.STATISTICS_STATISTICS_WRITE);
    requestMatchers(GET, BaseUrls.Statistics.ANALYSIS_URL + "/**")
        .hasAnyRole(
            EmployeePermissionRole.STATISTICS_STATISTICS_READ,
            EmployeePermissionRole.STATISTICS_STATISTICS_WRITE);
    requestMatchers(PATCH, BaseUrls.Statistics.ANALYSIS_URL + "/**")
        .hasRole(EmployeePermissionRole.STATISTICS_STATISTICS_WRITE);
    requestMatchers(DELETE, BaseUrls.Statistics.ANALYSIS_URL + "/**")
        .hasRole(EmployeePermissionRole.STATISTICS_STATISTICS_WRITE);

    requestMatchers(POST, BaseUrls.Statistics.EVALUATION_CONTROLLER)
        .hasRole(EmployeePermissionRole.STATISTICS_STATISTICS_WRITE);
    requestMatchers(POST, BaseUrls.Statistics.EVALUATION_CONTROLLER + "/clone")
        .hasRole(EmployeePermissionRole.STATISTICS_STATISTICS_WRITE);
    requestMatchers(GET, BaseUrls.Statistics.EVALUATION_CONTROLLER + "/**")
        .hasAnyRole(
            EmployeePermissionRole.STATISTICS_STATISTICS_READ,
            EmployeePermissionRole.STATISTICS_STATISTICS_WRITE);
    requestMatchers(PATCH, BaseUrls.Statistics.EVALUATION_CONTROLLER + "/**")
        .hasRole(EmployeePermissionRole.STATISTICS_STATISTICS_WRITE);
    requestMatchers(DELETE, BaseUrls.Statistics.EVALUATION_CONTROLLER + "/**")
        .hasRole(EmployeePermissionRole.STATISTICS_STATISTICS_WRITE);
    requestMatchers(
            POST,
            BaseUrls.Statistics.EVALUATION_CONTROLLER
                + BaseUrls.Statistics.RETRIEVE_DATA_URL
                + "/**")
        .hasAnyRole(
            EmployeePermissionRole.STATISTICS_STATISTICS_READ,
            EmployeePermissionRole.STATISTICS_STATISTICS_WRITE);
    requestMatchers(POST, BaseUrls.Statistics.EVALUATION_CONTROLLER + OVERVIEW_PATH)
        .hasAnyRole(
            EmployeePermissionRole.STATISTICS_STATISTICS_READ,
            EmployeePermissionRole.STATISTICS_STATISTICS_WRITE);

    requestMatchers(POST, BaseUrls.Statistics.REPORT_SERIES_URL + OVERVIEW_PATH)
        .hasAnyRole(
            EmployeePermissionRole.STATISTICS_STATISTICS_READ,
            EmployeePermissionRole.STATISTICS_STATISTICS_WRITE);
    requestMatchers(POST, BaseUrls.Statistics.REPORT_SERIES_URL + "/**")
        .hasRole(EmployeePermissionRole.STATISTICS_STATISTICS_WRITE);
    requestMatchers(PATCH, BaseUrls.Statistics.REPORT_SERIES_URL + "/**")
        .hasRole(EmployeePermissionRole.STATISTICS_STATISTICS_WRITE);
    requestMatchers(DELETE, BaseUrls.Statistics.REPORT_SERIES_URL + "/**")
        .hasRole(EmployeePermissionRole.STATISTICS_STATISTICS_WRITE);

    requestMatchers(GET, BaseUrls.Statistics.REPORT_URL + "/**")
        .hasAnyRole(
            EmployeePermissionRole.STATISTICS_STATISTICS_READ,
            EmployeePermissionRole.STATISTICS_STATISTICS_WRITE);
    requestMatchers(DELETE, BaseUrls.Statistics.REPORT_URL + "/**")
        .hasRole(EmployeePermissionRole.STATISTICS_STATISTICS_WRITE);

    requestMatchers(BaseUrls.Statistics.DATA_SOURCE_CONTROLLER + "/**")
        .hasAnyRole(
            EmployeePermissionRole.STATISTICS_STATISTICS_READ,
            EmployeePermissionRole.STATISTICS_STATISTICS_WRITE);

    requestMatchers(BaseUrls.Statistics.DATA_EXPORT_CONTROLLER + "/**")
        .hasAnyRole(
            EmployeePermissionRole.STATISTICS_STATISTICS_READ,
            EmployeePermissionRole.STATISTICS_STATISTICS_WRITE);

    requestMatchers(POST, BaseUrls.Statistics.GEO_SHAPE_CONTROLLER + "/**")
        .hasRole(EmployeePermissionRole.STATISTICS_STATISTICS_ADMIN);
    requestMatchers(GET, BaseUrls.Statistics.GEO_SHAPE_CONTROLLER + "/**")
        .hasAnyRole(
            EmployeePermissionRole.STATISTICS_STATISTICS_READ,
            EmployeePermissionRole.STATISTICS_STATISTICS_WRITE);
    requestMatchers(PATCH, BaseUrls.Statistics.GEO_SHAPE_CONTROLLER + "/**")
        .hasRole(EmployeePermissionRole.STATISTICS_STATISTICS_ADMIN);
    requestMatchers(DELETE, BaseUrls.Statistics.GEO_SHAPE_CONTROLLER + "/**")
        .hasRole(EmployeePermissionRole.STATISTICS_STATISTICS_ADMIN);

    requestMatchers(POST, BaseUrls.Statistics.FILTER_TEMPLATE_CONTROLLER + "/**")
        .hasRole(EmployeePermissionRole.STATISTICS_STATISTICS_WRITE);
    requestMatchers(GET, BaseUrls.Statistics.FILTER_TEMPLATE_CONTROLLER + "/**")
        .hasAnyRole(
            EmployeePermissionRole.STATISTICS_STATISTICS_READ,
            EmployeePermissionRole.STATISTICS_STATISTICS_WRITE);
    requestMatchers(PATCH, BaseUrls.Statistics.FILTER_TEMPLATE_CONTROLLER + "/**")
        .hasRole(EmployeePermissionRole.STATISTICS_STATISTICS_WRITE);
    requestMatchers(DELETE, BaseUrls.Statistics.FILTER_TEMPLATE_CONTROLLER + "/**")
        .hasRole(EmployeePermissionRole.STATISTICS_STATISTICS_WRITE);

    requestMatchers(POST, BaseUrls.Statistics.CENTRAL_REPOSITORY_CONTROLLER + "/**")
        .hasRole(EmployeePermissionRole.STATISTICS_STATISTICS_WRITE);
    requestMatchers(DELETE, BaseUrls.Statistics.CENTRAL_REPOSITORY_CONTROLLER + "/**")
        .hasRole(EmployeePermissionRole.STATISTICS_STATISTICS_WRITE);
    requestMatchers(GET, BaseUrls.Statistics.CENTRAL_REPOSITORY_CONTROLLER + "/**")
        .hasAnyRole(
            EmployeePermissionRole.STATISTICS_STATISTICS_READ,
            EmployeePermissionRole.STATISTICS_STATISTICS_WRITE);

    requestMatchers(POST, BaseUrls.Statistics.EVALUATION_TEMPLATE_CONTROLLER)
        .hasRole(EmployeePermissionRole.STATISTICS_STATISTICS_WRITE);
    requestMatchers(PATCH, BaseUrls.Statistics.EVALUATION_TEMPLATE_CONTROLLER + "/**")
        .hasRole(EmployeePermissionRole.STATISTICS_STATISTICS_WRITE);
    requestMatchers(DELETE, BaseUrls.Statistics.EVALUATION_TEMPLATE_CONTROLLER + "/**")
        .hasRole(EmployeePermissionRole.STATISTICS_STATISTICS_WRITE);
    requestMatchers(GET, BaseUrls.Statistics.EVALUATION_TEMPLATE_CONTROLLER + "/**")
        .hasAnyRole(
            EmployeePermissionRole.STATISTICS_STATISTICS_READ,
            EmployeePermissionRole.STATISTICS_STATISTICS_WRITE);
    requestMatchers(POST, BaseUrls.Statistics.EVALUATION_TEMPLATE_CONTROLLER + OVERVIEW_PATH)
        .hasAnyRole(
            EmployeePermissionRole.STATISTICS_STATISTICS_READ,
            EmployeePermissionRole.STATISTICS_STATISTICS_WRITE);
  }
}
