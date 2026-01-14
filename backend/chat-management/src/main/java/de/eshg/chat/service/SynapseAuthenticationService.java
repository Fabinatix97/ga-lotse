/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.chat.service;

import de.eshg.chat.SynapseProperties;
import de.eshg.chat.model.synapse.*;
import de.eshg.rest.service.error.BadRequestException;
import java.net.URI;
import java.time.Clock;
import java.time.Instant;
import java.util.Objects;
import org.matrix.login.api.SessionManagementApi;
import org.matrix.login.model.Login200Response;
import org.matrix.login.model.LoginRequest;
import org.matrix.refresh.api.DefaultApi;
import org.matrix.refresh.model.Refresh200Response;
import org.matrix.refresh.model.RefreshRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

@Component
public class SynapseAuthenticationService {

  private static final Logger log = LoggerFactory.getLogger(SynapseAuthenticationService.class);

  private final SynapseProperties synapseProperties;
  private final DefaultApi refreshApi;
  private final SessionManagementApi sessionManagementApi;
  private final Clock clock;

  private SynapseTokenData synapseTokenData;

  public SynapseAuthenticationService(
      SynapseProperties synapseProperties, RestClient.Builder restClientBuilder, Clock clock) {
    this.synapseProperties = synapseProperties;
    this.clock = clock;

    var loginApiClient = new org.matrix.login.ApiClient(restClientBuilder.build());
    loginApiClient.setBasePath(
        replaceSchemeHostAndPort(loginApiClient.getBasePath(), synapseProperties.internal().url()));
    this.sessionManagementApi = new SessionManagementApi(loginApiClient);

    var refreshApiClient = new org.matrix.refresh.ApiClient(restClientBuilder.build());
    refreshApiClient.setBasePath(
        replaceSchemeHostAndPort(
            refreshApiClient.getBasePath(), synapseProperties.internal().url()));
    this.refreshApi = new DefaultApi(refreshApiClient);
  }

  public String getAccessToken() {
    if (synapseTokenData == null) {
      synapseTokenData = getNewAccessToken();
    } else if (accessTokenExpired(synapseTokenData)) {
      synapseTokenData = tryRefreshAccessToken(synapseTokenData);
    }
    return synapseTokenData.accessToken();
  }

  private boolean accessTokenExpired(SynapseTokenData synapseTokenData) {
    return Instant.now(clock)
        .isAfter(
            synapseTokenData
                .expiresAt()
                .minus(
                    synapseProperties
                        .refreshClockSkew())); // Refresh token if is about to expire in <1 minute
  }

  private SynapseTokenData getNewAccessToken() {
    log.debug("Login to get Synapse AccessToken");
    try {
      LoginRequest loginRequest =
          new LoginRequest()
              .type("m.login.password")
              .refreshToken(true)
              .user(synapseProperties.admin().name())
              .password(synapseProperties.admin().password());

      Login200Response response = sessionManagementApi.login(loginRequest);

      String synapseAccessToken =
          Objects.requireNonNull(response.getAccessToken(), "Access token expected");
      Instant expiresAt =
          Instant.now(clock)
              .plusMillis(
                  Objects.requireNonNull(
                      response.getExpiresInMs(), "Access token is expected to expire"));
      String synapseRefreshToken =
          Objects.requireNonNull(response.getRefreshToken(), "Refresh token expected");

      return new SynapseTokenData(synapseAccessToken, expiresAt, synapseRefreshToken);
    } catch (Exception ex) {
      throw new BadRequestException(
          "Failed to obtain new AccessToken from Synapse server.", ex.getMessage());
    }
  }

  private SynapseTokenData tryRefreshAccessToken(SynapseTokenData synapseTokenData) {
    log.debug("Refreshing Synapse AccessToken");
    try {
      RefreshRequest refreshRequest =
          new RefreshRequest().refreshToken(synapseTokenData.refreshToken());

      Refresh200Response response = refreshApi.refresh(refreshRequest);

      String synapseAccessToken =
          Objects.requireNonNull(response.getAccessToken(), "Access token expected");
      Instant expiresAt =
          Instant.now(clock)
              .plusMillis(
                  Objects.requireNonNull(
                      response.getExpiresInMs(), "Access token is expected to expire"));
      String synapseRefreshToken =
          Objects.requireNonNull(response.getRefreshToken(), "Refresh token expected");

      return new SynapseTokenData(synapseAccessToken, expiresAt, synapseRefreshToken);
    } catch (Exception ex) {
      log.error(
          "Failed to refresh AccessToken from Synapse server. Trying login for new AccessToken",
          ex);
      return getNewAccessToken();
    }
  }

  private static String replaceSchemeHostAndPort(String basePath, URI uri) {
    return UriComponentsBuilder.fromUriString(basePath)
        .scheme(uri.getScheme())
        .host(uri.getHost())
        .port(uri.getPort())
        .build()
        .toString();
  }
}
