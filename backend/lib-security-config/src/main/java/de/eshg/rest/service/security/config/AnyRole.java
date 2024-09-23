/*
 * Copyright 2024 cronn GmbH
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

public record AnyRole(Set<String> keycloakRoleNames) implements AuthorizationDefinition {

  public AnyRole(PermissionRole... roles) {
    this(
        Arrays.stream(roles)
            .map(PermissionRole::getKeycloakName)
            .collect(StreamUtil.toLinkedHashSet()));
  }

  public boolean intersects(List<String> keycloakRoleNames) {
    return keycloakRoleNames().stream().anyMatch(keycloakRoleNames::contains);
  }

  @Override
  public void customize(AuthorizeHttpRequestsConfigurer<HttpSecurity>.AuthorizedUrl authorizedUrl) {
    authorizedUrl.hasAnyRole(keycloakRoleNames().toArray(String[]::new));
  }
}
