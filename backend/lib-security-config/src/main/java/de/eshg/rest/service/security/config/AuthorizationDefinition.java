/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.security.config;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AuthorizeHttpRequestsConfigurer;

public sealed interface AuthorizationDefinition permits AnyRole, Authenticated, PermitAll {
  void customize(AuthorizeHttpRequestsConfigurer<HttpSecurity>.AuthorizedUrl authorizedUrl);

  default AuthorizationDefinition or(AuthorizationDefinition otherAuthorizationDefinition) {
    throw new IllegalArgumentException(
        "Not implemented for " + this + " and " + otherAuthorizationDefinition);
  }
}
