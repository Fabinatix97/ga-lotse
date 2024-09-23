/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.client;

import static org.springframework.http.HttpHeaders.AUTHORIZATION;

import java.io.IOException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpRequest;
import org.springframework.http.client.ClientHttpRequestExecution;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.util.Assert;

public class AccessTokenForwardingInterceptor implements ClientHttpRequestInterceptor {
  @Override
  public ClientHttpResponse intercept(
      HttpRequest request, byte[] body, ClientHttpRequestExecution execution) throws IOException {
    passAccessTokenIfAvailable(request);
    return execution.execute(request, body);
  }

  private static void passAccessTokenIfAvailable(HttpRequest request) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication instanceof JwtAuthenticationToken token) {
      Jwt jwt = token.getToken();
      Assert.state(
          tokenIsNotSetOrEqual(request.getHeaders(), jwt.getTokenValue()),
          "Expected authorization header to be null");
      request.getHeaders().setBearerAuth(jwt.getTokenValue());
    }
  }

  private static boolean tokenIsNotSetOrEqual(HttpHeaders headers, String token) {
    String authorizationHeader = headers.getFirst(AUTHORIZATION);
    return authorizationHeader == null || authorizationHeader.equals("Bearer " + token);
  }
}
