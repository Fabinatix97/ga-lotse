/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.security.auth.synapse;

import de.eshg.security.auth.AuthProperties;
import java.time.Clock;
import java.time.Instant;
import java.util.Objects;
import org.matrix.refresh.ApiClient;
import org.matrix.refresh.api.DefaultApi;
import org.matrix.refresh.model.Refresh200Response;
import org.matrix.refresh.model.RefreshRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

@Component
@ConditionalOnSynapseUrl
public class MatrixRefreshClient {

  private static final Logger log = LoggerFactory.getLogger(MatrixRefreshClient.class);

  private final DefaultApi refreshApi;
  private final Clock clock;

  public MatrixRefreshClient(
      AuthProperties authProperties, RestClient.Builder restClientBuilder, Clock clock) {
    ApiClient apiClient = new ApiClient(restClientBuilder.build());
    apiClient.setBasePath(
        MatrixClientUtils.replaceSchemeHostAndPort(apiClient.getBasePath(), authProperties));
    this.refreshApi = new DefaultApi(apiClient);
    this.clock = clock;
  }

  SynapseTokenData refresh(SynapseTokenData synapseTokenData) throws RestClientResponseException {
    log.debug("Refreshing Synapse AccessToken for deviceId={}", synapseTokenData.deviceId());

    RefreshRequest refreshRequest = new RefreshRequest();
    refreshRequest.setRefreshToken(synapseTokenData.refreshToken());

    Refresh200Response response = refreshApi.refresh(refreshRequest);

    String synapseAccessToken = response.getAccessToken();
    Instant expiresAt =
        Instant.now(clock)
            .plusMillis(
                Objects.requireNonNull(
                    response.getExpiresInMs(), "Access token is expected to expire"));
    String synapseRefreshToken =
        Objects.requireNonNull(response.getRefreshToken(), "Refresh token expected");
    String deviceId = Objects.requireNonNull(synapseTokenData.deviceId(), "DeviceId expected");

    return new SynapseTokenData(synapseAccessToken, expiresAt, synapseRefreshToken, deviceId);
  }
}
