/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lsd.keycloak.properties;

import java.time.Duration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "eshg.lsd-keycloak.internal")
public record LsdInternalKeycloakProperties(
    String url,
    String realmDisplayName,
    User admin,
    Duration eventExpiration,
    Duration sessionTimeout,
    boolean lenientPasswordPolicy) {

  private static final Logger log = LoggerFactory.getLogger(LsdInternalKeycloakProperties.class);

  public LsdInternalKeycloakProperties {
    log.info("Local Service Directory Keycloak internal URL: {}", url);
  }

  public record User(String user, String password) {}
}
