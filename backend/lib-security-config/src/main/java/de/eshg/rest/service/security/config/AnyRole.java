/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.security.config;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.lib.keycloak.PermissionRole;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AuthorizeHttpRequestsConfigurer;

public record AnyRole(Set<String> roleNames) implements AuthorizationDefinition {

  public AnyRole(Set<String> roleNames) {
    if (roleNames.isEmpty()) {
      throw new IllegalArgumentException("roleNames is empty");
    }
    this.roleNames = roleNames;
  }

  public AnyRole(PermissionRole... roles) {
    this(Arrays.stream(roles).map(PermissionRole::name).collect(StreamUtil.toLinkedHashSet()));
  }

  public boolean intersects(List<String> roleNames) {
    return roleNames().stream().anyMatch(roleNames::contains);
  }

  @Override
  public void customize(AuthorizeHttpRequestsConfigurer<HttpSecurity>.AuthorizedUrl authorizedUrl) {
    authorizedUrl.hasAnyRole(roleNames().toArray(String[]::new));
  }
}
