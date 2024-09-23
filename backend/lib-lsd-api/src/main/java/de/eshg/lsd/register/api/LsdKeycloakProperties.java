/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lsd.register.api;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "eshg.lsd-keycloak")
public record LsdKeycloakProperties(LsdClientKeycloakProperties client, User actor) {

  public record User(String user, String password) {}
}
