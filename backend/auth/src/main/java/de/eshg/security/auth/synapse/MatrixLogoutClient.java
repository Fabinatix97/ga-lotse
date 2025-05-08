/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.security.auth.synapse;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.security.auth.AuthProperties;
import org.matrix.whoami.ApiClient;
import org.matrix.whoami.api.SessionManagementApi;
import org.matrix.whoami.auth.HttpBearerAuth;
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
  private final MatrixRefreshClient matrixRefreshClient;

  public MatrixLogoutClient(
      AuthProperties authProperties,
      RestClient.Builder restClientBuilder,
      SynapseTokenDataHolder synapseTokenDataHolder,
      MatrixRefreshClient matrixRefreshClient) {
    this.synapseTokenDataHolder = synapseTokenDataHolder;
    ApiClient apiClient = new ApiClient(restClientBuilder.build());
    apiClient.setBasePath(
        MatrixClientUtils.replaceSchemeHostAndPort(apiClient.getBasePath(), authProperties));
    configureBearerAuth(apiClient, synapseTokenDataHolder);
    this.sessionManagementApi = new SessionManagementApi(apiClient);
    this.matrixRefreshClient = matrixRefreshClient;
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

  /**
   * Invalidates SynapseRefreshToken, clears cached SynapseAccessToken and SynapseRefreshToken.
   *
   * <p>NOTICE: Calling synapse/logout endpoint destroys deviceId and Olm session on the server,
   * forcing user to create new device on next login which will **not** be able to decrypt chat
   * message history since all the room keys were stored on deviceId destroyed by synapse/logout! In
   * order to work around this unfortunate design flaw we are calling synapse/refresh endpoint in
   * order to invalidate current SynapseRefreshToken, and then we don't cache the newly obtained
   * SynapseRefreshToken.
   */
  public void logout() {
    if (isLoggedIn()) {
      log.debug(
          "Calling synapse/refresh token endpoint in order to invalidate current SynapseRefreshToken.");
      SynapseTokenData refreshedSynapseTokenData =
          matrixRefreshClient.refresh(synapseTokenDataHolder.getSynapseTokenData());
      synapseTokenDataHolder.setSynapseTokenData(refreshedSynapseTokenData);

      // SynapseRefreshToken is invalidated **only** if the new SynapseAccessToken is used at least
      // once:
      sessionManagementApi.getTokenOwner();

      log.debug("Remove SynapseTokenData from cache");
      synapseTokenDataHolder.setSynapseTokenData(null);
    }
  }
}
