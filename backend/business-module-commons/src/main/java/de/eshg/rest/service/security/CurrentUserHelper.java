/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.security;

import static de.eshg.lib.keycloak.CitizenUserAttribute.BUND_ID_B_PK_2;
import static de.eshg.lib.keycloak.CitizenUserAttribute.MUK_DATA_TRANSMITTER_PSEUDONYM_ID;
import static de.eshg.lib.keycloak.EmployeePermissionRole.STANDARD_EMPLOYEE;

import de.eshg.lib.keycloak.CitizenUserAttribute;
import de.eshg.lib.keycloak.PermissionRole;
import de.eshg.rest.client.ModuleClientAuthentication;
import de.eshg.rest.client.ModuleClientAuthenticationHolder;
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
    return getModuleClientAuthenticationGracefully()
        .or(CurrentUserHelper::getCurrentUserIdFromSecurityContextGracefully);
  }

  public static UUID getCurrentUserId() {
    return getCurrentUserIdGracefully()
        .orElseThrow(() -> new IllegalStateException("No current userId available"));
  }

  public static Optional<String> getCurrentUserIdAsStringGracefully() {
    return getCurrentUserIdGracefully().map(UUID::toString);
  }

  public static Optional<String> getCurrentUserSessionIdGracefully() {
    return getClaimGracefully("sid");
  }

  public static Optional<String> getMukIdGracefully() {
    return getClaimGracefully(MUK_DATA_TRANSMITTER_PSEUDONYM_ID);
  }

  public static Optional<String> getBundIdGracefully() {
    return getClaimGracefully(BUND_ID_B_PK_2);
  }

  private static Optional<String> getClaimGracefully(CitizenUserAttribute claimName) {
    return getClaimGracefully(claimName.getKey());
  }

  private static Optional<String> getClaimGracefully(String claimName) {
    return getAuthentication()
        .filter(JwtAuthenticationToken.class::isInstance)
        .map(JwtAuthenticationToken.class::cast)
        .map(JwtAuthenticationToken::getToken)
        .map(token -> token.getClaims().get(claimName))
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

  public static boolean isEmployee() {
    return currentUserHasRole(STANDARD_EMPLOYEE)
        && getBundIdGracefully().isEmpty()
        && getMukIdGracefully().isEmpty();
  }

  private static Optional<UUID> getCurrentUserIdFromSecurityContextGracefully() {
    return getAuthentication().map(Principal::getName).map(UUID::fromString);
  }

  private static Optional<UUID> getModuleClientAuthenticationGracefully() {
    return Optional.ofNullable(ModuleClientAuthenticationHolder.getModuleClientAuthentication())
        .map(ModuleClientAuthentication::userId);
  }

  private static Optional<Authentication> getAuthentication() {
    return Optional.ofNullable(SecurityContextHolder.getContext())
        .map(SecurityContext::getAuthentication);
  }
}
