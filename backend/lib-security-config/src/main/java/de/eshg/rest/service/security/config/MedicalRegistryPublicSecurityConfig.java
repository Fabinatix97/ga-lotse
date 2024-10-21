/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.security.config;

import de.eshg.lib.keycloak.EmployeePermissionRole;
import de.eshg.lib.keycloak.ModuleLeaderRole;
import org.springframework.stereotype.Component;

@Component
public final class MedicalRegistryPublicSecurityConfig extends AbstractPublicSecurityConfiguration {

  protected MedicalRegistryPublicSecurityConfig() {
    super("medical-registry");
    grantAccessToLibProceduresUrls(
        EmployeePermissionRole.MEDICAL_REGISTRY_ADMIN, ModuleLeaderRole.MEDICAL_REGISTRY_LEADER);

    requestMatchers(BaseUrls.MedicalRegistry.MEDICAL_REGISTRY_CONTROLLER + "/**")
        .hasRole(EmployeePermissionRole.MEDICAL_REGISTRY_ADMIN);
  }
}
