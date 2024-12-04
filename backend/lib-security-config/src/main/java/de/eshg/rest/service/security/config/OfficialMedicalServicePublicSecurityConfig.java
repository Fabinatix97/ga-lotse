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
public class OfficialMedicalServicePublicSecurityConfig
    extends AbstractPublicSecurityConfiguration {
  OfficialMedicalServicePublicSecurityConfig() {
    super("official-medical-service");

    grantAccessToLibProceduresUrls(
        EmployeePermissionRole.OFFICIAL_MEDICAL_SERVICE_ADMIN,
        ModuleLeaderRole.OFFICIAL_MEDICAL_SERVICE_LEADER);

    requestMatchers(BaseUrls.OfficialMedicalService.CITIZEN_PUBLIC_API + "/**").permitAll();

    requestMatchers(BaseUrls.OfficialMedicalService.CITIZEN_AUTH_API + "/**")
        .hasRole(CitizenPermissionRole.ACCESS_CODE_USER);

    requestMatchers(BaseUrls.OfficialMedicalService.EMPLOYEE_API + "/**")
        .hasRole(EmployeePermissionRole.OFFICIAL_MEDICAL_SERVICE_ADMIN);

    requestMatchers(BaseUrls.OfficialMedicalService.EMPLOYEE_API + "/**")
        .hasRole(EmployeePermissionRole.OFFICIAL_MEDICAL_SERVICE_PHYSICIAN);
  }
}
