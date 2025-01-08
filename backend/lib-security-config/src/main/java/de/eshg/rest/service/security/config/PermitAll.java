/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.security.config;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AuthorizeHttpRequestsConfigurer;

public final class PermitAll implements AuthorizationDefinition {
  @Override
  public void customize(AuthorizeHttpRequestsConfigurer<HttpSecurity>.AuthorizedUrl authorizedUrl) {
    authorizedUrl.permitAll();
  }

  @Override
  public String toString() {
    return "permit all";
  }
}
