/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.security.auth;

import de.cronn.commons.lang.StreamUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.Arrays;
import java.util.Objects;
import java.util.function.Supplier;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.security.web.csrf.CsrfTokenRequestHandler;

public class CsrfTokenRequestHandlerFromCookie implements CsrfTokenRequestHandler {
  @Override
  public void handle(
      HttpServletRequest request, HttpServletResponse response, Supplier<CsrfToken> csrfToken) {
    // noop
  }

  @Override
  public String resolveCsrfTokenValue(HttpServletRequest request, CsrfToken csrfToken) {
    return Arrays.stream(request.getCookies())
        .filter(cookie -> Objects.equals(cookie.getName(), LogoutController.CSRF_TOKEN_COOKIE_NAME))
        .collect(StreamUtil.toSingleOptionalElement())
        .map(Cookie::getValue)
        .orElse(null);
  }
}
