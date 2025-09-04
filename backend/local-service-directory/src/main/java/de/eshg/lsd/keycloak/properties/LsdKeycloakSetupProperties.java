/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lsd.keycloak.properties;

import java.time.Duration;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "eshg.lsd-keycloak.setup")
public record LsdKeycloakSetupProperties(
    String realmDisplayName,
    AdminUser adminUser,
    AdminClient adminClient,
    Duration eventExpiration,
    Duration sessionTimeout) {
  public record AdminUser(String user, String password) {}

  public record AdminClient(String clientId, String clientSecret) {}
}
