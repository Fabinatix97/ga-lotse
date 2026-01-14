/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.security.config;

import org.springframework.http.HttpMethod;

public record HttpMethodAndUrlPattern(HttpMethod method, String urlPattern) {
  boolean hasMethod(HttpMethod method) {
    return method() == null || method().equals(method);
  }
}
