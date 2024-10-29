/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.security;

import de.eshg.lib.keycloak.PermissionRole;
import java.security.Principal;
import java.util.Optional;
import java.util.UUID;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

public final class CurrentUserHelper {
  private CurrentUserHelper() {}

  public static Optional<UUID> getCurrentUserIdGracefully() {
    return getAuthentication().map(Principal::getName).map(UUID::fromString);
  }

  public static UUID getCurrentUserId() {
    return getCurrentUserIdGracefully()
        .orElseThrow(() -> new IllegalStateException("No current userId available"));
  }

  public static Optional<String> getCurrentUserIdAsStringGracefully() {
    return getCurrentUserIdGracefully().map(UUID::toString);
  }

  public static Optional<String> getCurrentUserSessionIdGracefully() {
    return getAuthentication()
        .filter(JwtAuthenticationToken.class::isInstance)
        .map(JwtAuthenticationToken.class::cast)
        .map(JwtAuthenticationToken::getToken)
        .map(token -> token.getClaims().get("sid"))
        .map(String::valueOf);
  }

  public static boolean currentUserHasNoRole(PermissionRole role) {
    return !currentUserHasRole(role);
  }

  public static boolean currentUserHasRole(PermissionRole role) {
    Optional<Authentication> authentication = getAuthentication();
    if (authentication.isPresent()
        && authentication.get() instanceof JwtAuthenticationToken token) {
      return token.getAuthorities().stream()
          .anyMatch(granted -> granted.getAuthority().equals("ROLE_" + role.name()));
    }
    return false;
  }

  private static Optional<Authentication> getAuthentication() {
    return Optional.ofNullable(SecurityContextHolder.getContext())
        .map(SecurityContext::getAuthentication);
  }
}
