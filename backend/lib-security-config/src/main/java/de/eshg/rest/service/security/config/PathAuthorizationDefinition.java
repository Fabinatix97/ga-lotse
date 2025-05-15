/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.security.config;

import org.springframework.http.HttpMethod;

record PathAuthorizationDefinition(
    HttpMethodAndUrlPattern httpMethodAndUrlPattern,
    AuthorizationDefinition authorizationDefinition) {

  HttpMethod method() {
    return httpMethodAndUrlPattern().method();
  }

  String urlPattern() {
    return httpMethodAndUrlPattern().urlPattern();
  }
}
