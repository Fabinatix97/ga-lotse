/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.security.auth.synapse;

import de.eshg.security.auth.AuthProperties;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

final class MatrixClientUtils {

  private MatrixClientUtils() {}

  static String replaceSchemeHostAndPort(String basePath, AuthProperties authProperties) {
    UriComponents configuredBaseUri =
        UriComponentsBuilder.fromUri(authProperties.synapse().internal().url()).build();

    return UriComponentsBuilder.fromUriString(basePath)
        .scheme(configuredBaseUri.getScheme())
        .host(configuredBaseUri.getHost())
        .port(configuredBaseUri.getPort())
        .build()
        .toString();
  }
}
