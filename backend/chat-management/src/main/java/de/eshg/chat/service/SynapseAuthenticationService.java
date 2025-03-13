/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.chat.service;

import static de.eshg.chat.ChatManagementApplication.SYNAPSE_REST_TEMPLATE;
import static de.eshg.chat.service.RestUtils.getResponseBody;

import de.eshg.chat.SynapseProperties;
import de.eshg.chat.model.synapse.*;
import de.eshg.rest.service.error.BadRequestException;
import java.time.Clock;
import java.time.Instant;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class SynapseAuthenticationService {

  private static final Logger log = LoggerFactory.getLogger(SynapseAuthenticationService.class);

  private final SynapseProperties synapseProperties;
  private final RestTemplate restTemplate;
  private final Clock clock;

  private AccessToken accessToken;

  public SynapseAuthenticationService(
      @Autowired SynapseProperties synapseProperties,
      @Autowired @Qualifier(SYNAPSE_REST_TEMPLATE) RestTemplate synapseRestTemplate,
      @Autowired Clock clock) {
    this.synapseProperties = synapseProperties;
    this.restTemplate = synapseRestTemplate;
    this.clock = clock;
  }

  public String getAccessToken() {
    if (accessToken == null) {
      accessToken = getNewAccessToken();
    } else if (accessTokenExpired(accessToken)) {
      accessToken = tryRefreshAccessToken(accessToken);
    }
    return accessToken.getAccessToken();
  }

  private boolean accessTokenExpired(AccessToken accessToken) {
    return Instant.now(clock)
        .isAfter(
            accessToken
                .getTokenExpirationTime()
                .minus(
                    synapseProperties
                        .refreshClockSkew())); // Refresh token if is about to expire in <1 minute
  }

  private AccessToken getNewAccessToken() {
    try {
      ResponseEntity<GetAccessTokenResponse> response =
          restTemplate.postForEntity(
              synapseProperties.internal().url() + "/_matrix/client/r0/login",
              new GetAccessTokenRequest()
                  .type("m.login.password")
                  .user(synapseProperties.admin().name())
                  .password(synapseProperties.admin().password())
                  .refreshToken(true),
              GetAccessTokenResponse.class);

      GetAccessTokenResponse body = getResponseBody(response);
      return new AccessToken()
          .accessToken(body.getAccessToken())
          .refreshToken(body.getRefreshToken())
          .tokenExpirationTime(Instant.now(clock).plusMillis(body.getExpiresInMs()));

    } catch (Exception ex) {
      throw new BadRequestException(
          "Failed to obtain new AccessToken from Synapse server.", ex.getMessage());
    }
  }

  private AccessToken tryRefreshAccessToken(AccessToken accessToken) {
    try {
      ResponseEntity<RefreshTokenResponse> response =
          restTemplate.postForEntity(
              synapseProperties.internal().url() + "/_matrix/client/r0/refresh",
              new RefreshTokenRequest().refreshToken(accessToken.getRefreshToken()),
              RefreshTokenResponse.class);

      RefreshTokenResponse body = getResponseBody(response);
      return new AccessToken()
          .accessToken(body.getAccessToken())
          .refreshToken(body.getRefreshToken())
          .tokenExpirationTime(Instant.now(clock).plusMillis(body.getExpiresInMs()));
    } catch (Exception ex) {
      log.error(
          "Failed to refresh AccessToken from Synapse server. Trying login for new AccessToken",
          ex);
      return getNewAccessToken();
    }
  }
}
