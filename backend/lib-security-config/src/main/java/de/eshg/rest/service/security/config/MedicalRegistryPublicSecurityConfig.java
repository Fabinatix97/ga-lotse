/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.security.config;

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

    requestMatchers(
            HttpMethod.POST,
            MedicalRegistry.MEDICAL_REGISTRY_CONTROLLER
                + MedicalRegistry.CITIZEN_PORTAL_ENDPOINT
                + "/**")
        .permitAll();

    requestMatchers(BaseUrls.MedicalRegistry.MEDICAL_REGISTRY_CONTROLLER + "/**")
        .hasRole(EmployeePermissionRole.MEDICAL_REGISTRY_ADMIN);
  }
}
