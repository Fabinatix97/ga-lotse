/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.security.config;

import de.eshg.lib.keycloak.CitizenPermissionRole;
import de.eshg.lib.keycloak.EmployeePermissionRole;
import de.eshg.lib.keycloak.ModuleLeaderRole;
import de.eshg.rest.service.security.config.BaseUrls.OfficialMedicalService;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;

@Component
public class OfficialMedicalServicePublicSecurityConfig
    extends AbstractPublicSecurityConfiguration {
  OfficialMedicalServicePublicSecurityConfig() {
    super("official-medical-service");

    grantAccessToLibAppointmentBlockUrls(EmployeePermissionRole.OFFICIAL_MEDICAL_SERVICE_ADMIN);
    grantAccessToLibProceduresUrls(
        EmployeePermissionRole.OFFICIAL_MEDICAL_SERVICE_ADMIN,
        ModuleLeaderRole.OFFICIAL_MEDICAL_SERVICE_LEADER);
    grantAccessToStatistics(EmployeePermissionRole.OFFICIAL_MEDICAL_SERVICE_ADMIN);
    grantAccessToConfiguration();

    requestMatchers(OfficialMedicalService.CITIZEN_PUBLIC_API + "/**").permitAll();

    requestMatchers(OfficialMedicalService.CITIZEN_AUTH_API + "/**")
        .hasRole(CitizenPermissionRole.ACCESS_CODE_USER);

    requestMatchers(
            HttpMethod.POST,
            OfficialMedicalService.EMPLOYEE_API + OfficialMedicalService.ASSESSMENT_API + "/**")
        .hasRole(EmployeePermissionRole.OFFICIAL_MEDICAL_SERVICE_ASSESSMENT_CREATE);

    requestMatchers(
            HttpMethod.PUT,
            OfficialMedicalService.EMPLOYEE_API
                + OfficialMedicalService.ASSESSMENT_API
                + "/*/preview-reader")
        .hasRole(EmployeePermissionRole.OFFICIAL_MEDICAL_SERVICE_ASSESSMENT_PREVIEW_READER_EDIT);

    requestMatchers(
            OfficialMedicalService.EMPLOYEE_API + "/**", BaseUrls.EVENT_METADATA_API + "/**")
        .hasRole(EmployeePermissionRole.OFFICIAL_MEDICAL_SERVICE_ADMIN);

    requestMatchers(OfficialMedicalService.FEATURE_TOGGLES_CONTROLLER + "/**")
        .hasRole(EmployeePermissionRole.STANDARD_EMPLOYEE);
  }
}
