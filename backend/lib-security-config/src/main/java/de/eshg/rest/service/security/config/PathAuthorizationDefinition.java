/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.security.config;

import org.springframework.http.HttpMethod;

record PathAuthorizationDefinition(
    HttpMethod method, String urlPattern, AuthorizationDefinition authorizationDefinition) {
  boolean hasMethod(HttpMethod method) {
    return method() == null || method().equals(method);
  }
}
