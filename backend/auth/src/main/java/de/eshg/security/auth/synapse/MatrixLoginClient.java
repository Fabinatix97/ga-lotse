/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.security.auth.synapse;

import de.eshg.security.auth.AuthProperties;
import java.time.Clock;
import java.time.Instant;
import java.util.Objects;
import org.matrix.login.ApiClient;
import org.matrix.login.api.SessionManagementApi;
import org.matrix.login.model.Login200Response;
import org.matrix.login.model.LoginRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.oauth2.core.OAuth2AccessToken;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
@ConditionalOnSynapseUrl
public class MatrixLoginClient {

  private static final Logger log = LoggerFactory.getLogger(MatrixLoginClient.class);

  private final SessionManagementApi sessionManagementApi;
  private final Clock clock;

  public MatrixLoginClient(
      AuthProperties authProperties, RestClient.Builder restClientBuilder, Clock clock) {
    ApiClient apiClient = new ApiClient(restClientBuilder.build());
    apiClient.setBasePath(
        MatrixClientUtils.replaceSchemeHostAndPort(apiClient.getBasePath(), authProperties));
    this.sessionManagementApi = new SessionManagementApi(apiClient);
    this.clock = clock;
  }

  SynapseTokenData login(OAuth2AccessToken accessToken, String requestedDeviceId) {
    if (requestedDeviceId != null) {
      log.debug("Requested login to get new AccessToken for deviceId={}", requestedDeviceId);
    } else {
      log.debug(
          "Requested login for new deviceId: Synapse will generate new deviceId. "
              + "Matrix Client must now setup cross signing from 4S backup with this new deviceId "
              + "to be able to access encrypted messages history on that device.");
    }

    LoginRequest loginRequest = new LoginRequest();
    loginRequest.setType("org.matrix.login.jwt");
    loginRequest.setRefreshToken(true);
    loginRequest.setDeviceId(requestedDeviceId);
    loginRequest.setToken(accessToken.getTokenValue());

    Login200Response response = sessionManagementApi.login(loginRequest);

    String synapseAccessToken = response.getAccessToken();
    Instant expiresAt =
        Instant.now(clock)
            .plusMillis(
                Objects.requireNonNull(
                    response.getExpiresInMs(), "Access token is expected to expire"));
    String synapseRefreshToken =
        Objects.requireNonNull(response.getRefreshToken(), "Refresh token expected");
    String deviceId = Objects.requireNonNull(response.getDeviceId(), "DeviceId expected");

    log.debug("Login successful for deviceId={}", deviceId);
    return new SynapseTokenData(synapseAccessToken, expiresAt, synapseRefreshToken, deviceId);
  }
}
