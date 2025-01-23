/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.security.auth;

import com.google.common.collect.Iterables;
import io.swagger.v3.oas.annotations.Hidden;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.net.URI;
import java.time.Duration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.security.oauth2.client.OAuth2ClientProperties;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.security.web.csrf.CsrfTokenRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

@RestController
@Hidden
public class LogoutController {

  private static final Logger log = LoggerFactory.getLogger(LogoutController.class);

  public static final String INITIATE_LOGOUT_URL = "/logout/keycloak";
  public static final String CSRF_TOKEN_COOKIE_NAME = "LOGOUT-CSRF-TOKEN";
  private static final Duration CSRF_TOKEN_MAX_AGE = Duration.ofMinutes(10);

  private final CsrfTokenRepository csrfTokenRepository;
  private final AuthProperties authProperties;
  private final URI keycloakLogoutUrl;

  public LogoutController(
      CsrfTokenRepository csrfTokenRepository,
      OAuth2ClientProperties auth2ClientProperties,
      AuthProperties authProperties) {
    this.csrfTokenRepository = csrfTokenRepository;
    this.authProperties = authProperties;

    String oauthProvider =
        Iterables.getOnlyElement(auth2ClientProperties.getRegistration().keySet());
    String clientId = auth2ClientProperties.getRegistration().get(oauthProvider).getClientId();
    this.keycloakLogoutUrl =
        UriComponentsBuilder.fromUri(authProperties.keycloak().logout().url())
            .queryParam("client_id", clientId)
            .queryParam(
                "post_logout_redirect_uri",
                UriComponentsBuilder.fromUri(authProperties.reverseProxy().url())
                    .path(AuthServiceSecurityConfig.LOGOUT_URL)
                    .build())
            .build()
            .toUri();
    log.debug("Using Keycloak logout URL: {}", keycloakLogoutUrl);
  }

  @GetMapping(INITIATE_LOGOUT_URL)
  ResponseEntity<Void> initiateLogout(HttpServletRequest request, HttpServletResponse response) {
    CsrfToken csrfToken = csrfTokenRepository.generateToken(request);
    csrfTokenRepository.saveToken(csrfToken, request, response);

    String value = csrfToken.getToken();
    Cookie csrfTokenCookie =
        createLogoutCsrfTokenCookie(value, CSRF_TOKEN_MAX_AGE, request.getScheme());
    response.addCookie(csrfTokenCookie);

    return ResponseEntity.status(HttpStatus.FOUND).location(keycloakLogoutUrl).build();
  }

  public static Cookie createLogoutCsrfTokenCookie(
      String value, Duration maxAge, String requestScheme) {
    Cookie csrfTokenCookie = new Cookie(CSRF_TOKEN_COOKIE_NAME, value);
    csrfTokenCookie.setMaxAge(Math.toIntExact(maxAge.toSeconds()));
    csrfTokenCookie.setPath(AuthServiceSecurityConfig.LOGOUT_URL);
    csrfTokenCookie.setHttpOnly(true);
    csrfTokenCookie.setAttribute("SameSite", "Strict");
    csrfTokenCookie.setSecure(requestScheme.equals("https"));
    return csrfTokenCookie;
  }
}
