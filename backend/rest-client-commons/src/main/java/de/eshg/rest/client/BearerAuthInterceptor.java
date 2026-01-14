/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.client;

import static org.springframework.http.HttpHeaders.AUTHORIZATION;

import java.io.IOException;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpRequest;
import org.springframework.http.client.ClientHttpRequestExecution;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.AbstractOAuth2Token;
import org.springframework.security.oauth2.server.resource.authentication.AbstractOAuth2TokenAuthenticationToken;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.util.Assert;

public class BearerAuthInterceptor implements ClientHttpRequestInterceptor {

  private static final Logger log = LoggerFactory.getLogger(BearerAuthInterceptor.class);

  @Override
  public ClientHttpResponse intercept(
      HttpRequest request, byte[] body, ClientHttpRequestExecution execution) throws IOException {
    passAccessTokenIfAvailable(request);
    return execution.execute(request, body);
  }

  private static void passAccessTokenIfAvailable(HttpRequest request) {
    Optional<String> moduleClientAccessToken = getModuleClientAccessTokenGracefully();
    Optional<String> userClientAccessToken = getUserClientAccessTokenGracefully();

    if (moduleClientAccessToken.isPresent() && userClientAccessToken.isPresent()) {
      log.info(
          "Both user access token and module client access token are available. Proceeding with module client access token.");
    }

    moduleClientAccessToken
        .or(() -> userClientAccessToken)
        .ifPresent(
            accessToken -> {
              Assert.state(
                  tokenIsNotSetOrEqual(request.getHeaders(), accessToken),
                  "Expected authorization header to be null");
              request.getHeaders().setBearerAuth(accessToken);
            });
  }

  private static Optional<String> getModuleClientAccessTokenGracefully() {
    return Optional.ofNullable(ModuleClientAuthenticationHolder.getModuleClientAuthentication())
        .map(ModuleClientAuthentication::accessToken);
  }

  private static Optional<String> getUserClientAccessTokenGracefully() {
    return Optional.ofNullable(SecurityContextHolder.getContext())
        .map(SecurityContext::getAuthentication)
        .filter(JwtAuthenticationToken.class::isInstance)
        .map(JwtAuthenticationToken.class::cast)
        .map(AbstractOAuth2TokenAuthenticationToken::getToken)
        .map(AbstractOAuth2Token::getTokenValue);
  }

  private static boolean tokenIsNotSetOrEqual(HttpHeaders headers, String token) {
    String authorizationHeader = headers.getFirst(AUTHORIZATION);
    return authorizationHeader == null || authorizationHeader.equals("Bearer " + token);
  }
}
