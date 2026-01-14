/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.testhelper.security;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Supplier;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.JoseHeaderNames;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

public class AuthenticationFaker {
  public static <T> T withFakedAuthenticationIfMissing(UUID userId, Supplier<T> supplier) {
    Authentication authentication = getAuthentication();
    if (authentication != null) {
      return supplier.get();
    }
    try {
      Map<String, Object> headers = Map.of(JoseHeaderNames.TYP, "Bearer");
      Jwt jwt = new Jwt("fake token", null, null, headers, Map.of("sub", userId.toString()));
      SecurityContextHolder.getContext()
          .setAuthentication(new JwtAuthenticationToken(jwt, List.of(), userId.toString()));

      return supplier.get();
    } finally {
      SecurityContextHolder.getContext().setAuthentication(null);
    }
  }

  private static Authentication getAuthentication() {
    return SecurityContextHolder.getContext().getAuthentication();
  }
}
