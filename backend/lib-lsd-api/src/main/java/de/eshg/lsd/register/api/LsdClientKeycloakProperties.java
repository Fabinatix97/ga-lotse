/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lsd.register.api;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "eshg.lsd-keycloak.client")
public record LsdClientKeycloakProperties(
    String url, String realm, String clientId, String clientSecret) {}
