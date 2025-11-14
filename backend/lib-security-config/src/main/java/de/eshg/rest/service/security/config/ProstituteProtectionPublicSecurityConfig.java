/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.security.config;

import de.eshg.lib.keycloak.EmployeePermissionRole;
import org.springframework.stereotype.Component;

@Component
public final class ProstituteProtectionPublicSecurityConfig
    extends AbstractPublicSecurityConfiguration {
  ProstituteProtectionPublicSecurityConfig() {
    super("prostitute-protection");

    grantAccessToLibAppointmentBlockUrls(EmployeePermissionRole.PROSTITUTE_PROTECTION_ADMIN);
    grantAccessToConfiguration();
    grantAccessToStatistics(EmployeePermissionRole.PROSTITUTE_PROTECTION_ADMIN);
  }
}
