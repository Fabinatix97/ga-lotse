/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.security.config;

import static org.springframework.http.HttpMethod.GET;

import de.eshg.lib.keycloak.EmployeePermissionRole;
import de.eshg.lib.keycloak.ModuleLeaderRole;
import de.eshg.rest.service.security.config.BaseUrls.MedicalRegistry;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;

@Component
public final class MedicalRegistryPublicSecurityConfig extends AbstractPublicSecurityConfiguration {

  MedicalRegistryPublicSecurityConfig() {
    super("medical-registry");
    grantAccessToLibProceduresUrls(
        EmployeePermissionRole.MEDICAL_REGISTRY_ADMIN, ModuleLeaderRole.MEDICAL_REGISTRY_LEADER);
    grantAccessToConfiguration();

    requestMatchers(
            HttpMethod.POST,
            MedicalRegistry.MEDICAL_REGISTRY_CONTROLLER
                + MedicalRegistry.CITIZEN_PORTAL_ENDPOINT
                + "/**")
        .permitAll();

    requestMatchers(HttpMethod.GET, MedicalRegistry.FEATURE_TOGGLES_CONTROLLER + "/**").permitAll();

    requestMatchers(HttpMethod.GET, MedicalRegistry.CITIZEN_PORTAL_ENDPOINT + "/privacy-notice")
        .permitAll();

    requestMatchers(HttpMethod.GET, MedicalRegistry.CITIZEN_PORTAL_ENDPOINT + "/privacy-policy")
        .permitAll();

    requestMatchers(GET, BaseUrls.MedicalRegistry.MEDICAL_REGISTRY_CONTROLLER + "/*/**")
        .hasAnyRole(
            EmployeePermissionRole.MEDICAL_REGISTRY_ADMIN,
            EmployeePermissionRole.PROCEDURE_ARCHIVE);
    requestMatchers(BaseUrls.MedicalRegistry.MEDICAL_REGISTRY_CONTROLLER + "/**")
        .hasRole(EmployeePermissionRole.MEDICAL_REGISTRY_ADMIN);

    requestMatchers(MedicalRegistry.MEDICAL_REGISTRY_IMPORT_CONTROLLER + "/**")
        .hasRole(EmployeePermissionRole.MEDICAL_REGISTRY_IMPORT);
  }
}
