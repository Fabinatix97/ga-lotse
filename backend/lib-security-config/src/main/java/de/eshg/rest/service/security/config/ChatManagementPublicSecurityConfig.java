/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.security.config;

import de.eshg.lib.keycloak.EmployeePermissionRole;
import org.springframework.stereotype.Component;

@Component
public final class ChatManagementPublicSecurityConfig extends AbstractPublicSecurityConfiguration {
  ChatManagementPublicSecurityConfig() {
    super("chat-management");

    requestMatchers(BaseUrls.ChatManagement.USER_SETTINGS_CONTROLLER + "/**")
        .hasRole(EmployeePermissionRole.CHAT_MANAGEMENT_WRITE);

    requestMatchers(BaseUrls.ChatManagement.FEATURE_TOGGLES_CONTROLLER + "/**")
        .hasRole(EmployeePermissionRole.STANDARD_EMPLOYEE);
  }
}
