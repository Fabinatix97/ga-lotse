/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.security.auth;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.time.Duration;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.CookieClearingLogoutHandler;
import org.springframework.security.web.authentication.logout.LogoutHandler;

public final class LogoutCsrfTokenCookieClearingLogoutHandler implements LogoutHandler {

  @Override
  public void logout(
      HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
    Cookie logoutCsrfTokenCookie =
        LogoutController.createLogoutCsrfTokenCookie(null, Duration.ZERO, request.getScheme());
    new CookieClearingLogoutHandler(logoutCsrfTokenCookie)
        .logout(request, response, authentication);
  }
}
