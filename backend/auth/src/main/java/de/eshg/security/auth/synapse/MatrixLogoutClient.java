/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.security.auth.synapse;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.security.auth.AuthProperties;
import org.matrix.logout.ApiClient;
import org.matrix.logout.api.SessionManagementApi;
import org.matrix.logout.auth.HttpBearerAuth;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
@ConditionalOnSynapseUrl
public class MatrixLogoutClient {

  private static final Logger log = LoggerFactory.getLogger(MatrixLogoutClient.class);

  private final SessionManagementApi sessionManagementApi;
  private final SynapseTokenDataHolder synapseTokenDataHolder;
  private final AuthProperties authProperties;

  public MatrixLogoutClient(
      AuthProperties authProperties,
      RestClient.Builder restClientBuilder,
      SynapseTokenDataHolder synapseTokenDataHolder) {
    this.synapseTokenDataHolder = synapseTokenDataHolder;
    this.authProperties = authProperties;
    ApiClient apiClient = new ApiClient(restClientBuilder.build());
    apiClient.setBasePath(
        MatrixClientUtils.replaceSchemeHostAndPort(apiClient.getBasePath(), authProperties));
    configureBearerAuth(apiClient, synapseTokenDataHolder);
    this.sessionManagementApi = new SessionManagementApi(apiClient);
  }

  private void configureBearerAuth(
      ApiClient apiClient, SynapseTokenDataHolder synapseTokenDataHolder) {
    HttpBearerAuth httpBearerAuth =
        apiClient.getAuthentications().values().stream()
            .filter(HttpBearerAuth.class::isInstance)
            .map(HttpBearerAuth.class::cast)
            .collect(StreamUtil.toSingleElement());
    httpBearerAuth.setBearerToken(() -> synapseTokenDataHolder.getSynapseTokenData().accessToken());
  }

  private boolean isLoggedIn() {
    return synapseTokenDataHolder.getSynapseTokenData() != null;
  }

  public void logout() {
    if (isLoggedIn()) {
      if (authProperties.synapse().activeLogoutEnabled()) {
        log.debug(
            "Calling Synapse logout for deviceId={}.",
            synapseTokenDataHolder.getSynapseTokenData().deviceId());
        sessionManagementApi.logout();
      } else {
        log.warn(
            "Active Logout is disabled until proper SSSS backup handling is implemented in the frontend. "
                + "Reason: Calling synapse/logout endpoint destroys deviceId and Olm session on the server. "
                + "Frontend using this deviceId would no longer be able to decrypt incoming messages.");
      }
    } else {
      log.trace("Skipping logout call - No active Synapse session.");
    }
  }
}
