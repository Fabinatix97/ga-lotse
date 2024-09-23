/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.testhelper.interception;

public enum HttpMethod {
  GET,
  HEAD,
  POST,
  PUT,
  PATCH,
  DELETE,
  OPTIONS,
  TRACE;

  public static HttpMethod valueOf(org.springframework.http.HttpMethod httpMethod) {
    if (httpMethod == null) {
      return null;
    }
    return valueOf(httpMethod.name());
  }

  public boolean matches(String method) {
    return name().equals(method);
  }
}
