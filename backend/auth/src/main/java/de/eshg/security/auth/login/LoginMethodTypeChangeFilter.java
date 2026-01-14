/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.security.auth.login;

import static de.eshg.security.auth.AuthServiceSecurityConfig.actuatorMonitoringRequestMatcher;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.security.auth.AuthController;
import jakarta.annotation.Nonnull;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class LoginMethodTypeChangeFilter extends OncePerRequestFilter {

  private static final Logger log = LoggerFactory.getLogger(LoginMethodTypeChangeFilter.class);

  private final LoginMethodTypeHolder loginMethodTypeHolder;
  private final List<LoginMethod> loginMethods;
  private final KeycloakLogoutHelper keycloakLogoutHelper;

  public LoginMethodTypeChangeFilter(
      LoginMethodTypeHolder loginMethodTypeHolder,
      List<LoginMethod> loginMethods,
      KeycloakLogoutHelper keycloakLogoutHelper) {
    this.loginMethodTypeHolder = loginMethodTypeHolder;
    this.loginMethods = loginMethods;
    this.keycloakLogoutHelper = keycloakLogoutHelper;
  }

  @Override
  protected void doFilterInternal(
      @Nonnull HttpServletRequest request,
      @Nonnull HttpServletResponse response,
      FilterChain filterChain)
      throws ServletException, IOException {
    triggerReLoginIfRequired(request);
    filterChain.doFilter(request, response);
  }

  private void triggerReLoginIfRequired(HttpServletRequest request) {
    if (actuatorMonitoringRequestMatcher.matches(request)) {
      return;
    }
    LoginMethodType loginMethodType = loginMethodTypeHolder.getLoginMethodType();
    if (loginMethodType == null) {
      return;
    }

    String originalUri = request.getHeader(AuthController.X_ORIGINAL_URI_HEADER);
    if (originalUri == null) {
      return;
    }

    loginMethods.stream()
        .filter(loginMethod -> loginMethod.isApplicable(originalUri))
        .collect(StreamUtil.toSingleOptionalElement())
        .ifPresent(
            loginMethod -> {
              LoginMethodType requestedLoginMethodType =
                  loginMethod.getLoginMethodType(originalUri);
              log.debug("Got {}, expected: {}", loginMethodType, requestedLoginMethodType);

              if (requestedLoginMethodType != loginMethodType) {
                keycloakLogoutHelper.executeOpenIdConnectLogout(request);
                throw new LoginMethodTypeMismatchAuthorizationException();
              }
            });
  }
}
