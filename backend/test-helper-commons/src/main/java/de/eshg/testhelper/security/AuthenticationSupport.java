/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.testhelper.security;

import de.cronn.commons.lang.Action;
import de.eshg.testhelper.AccessToken;
import java.util.function.Supplier;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public final class AuthenticationSupport {

  private AuthenticationSupport() {}

  public static void withAuthentication(AccessToken accessToken, Action action) {
    withAuthentication(accessToken, action.toSupplier());
  }

  public static <T> T withAuthentication(AccessToken accessToken, Supplier<T> supplier) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    try {
      SecurityContextHolder.getContext()
          .setAuthentication(JwtAuthenticationTokenFactory.fromAccessToken(accessToken));

      return supplier.get();
    } finally {
      SecurityContextHolder.getContext().setAuthentication(authentication);
    }
  }
}
