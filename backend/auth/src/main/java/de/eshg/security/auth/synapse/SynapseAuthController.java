/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.security.auth.synapse;

import de.eshg.lib.keycloak.EmployeePermissionRole;
import de.eshg.security.auth.AuthProperties;
import de.eshg.security.auth.ForbiddenException;
import de.eshg.security.auth.RolesResolver;
import io.swagger.v3.oas.annotations.Hidden;
import java.time.Clock;
import java.time.Instant;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.annotation.RegisteredOAuth2AuthorizedClient;
import org.springframework.security.oauth2.core.OAuth2AccessToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(SynapseAuthController.BASE_URL)
@ConditionalOnSynapseUrl
@Hidden
public class SynapseAuthController {

  private static final Logger log = LoggerFactory.getLogger(SynapseAuthController.class);

  public static final String X_FORWARDED_MATRIX_DEVICE_ID = "X-Forwarded-Matrix-Device-Id";

  public static final String BASE_URL = "/synapse";

  private final AuthProperties authProperties;
  private final MatrixLoginClient matrixLoginClient;
  private final MatrixRefreshClient matrixRefreshClient;
  private final Clock clock;
  private final SynapseTokenDataHolder synapseTokenDataHolder;

  public SynapseAuthController(
      AuthProperties authProperties,
      MatrixLoginClient matrixLoginClient,
      MatrixRefreshClient matrixRefreshClient,
      Clock clock,
      SynapseTokenDataHolder synapseTokenDataHolder) {
    this.authProperties = authProperties;
    this.matrixLoginClient = matrixLoginClient;
    this.matrixRefreshClient = matrixRefreshClient;
    this.clock = clock;
    this.synapseTokenDataHolder = synapseTokenDataHolder;
  }

  @GetMapping
  ResponseEntity<Void> resolveSynapseAccessToken(
      @RegisteredOAuth2AuthorizedClient OAuth2AuthorizedClient client,
      @RequestHeader(value = X_FORWARDED_MATRIX_DEVICE_ID, required = false) String deviceId) {
    OAuth2AccessToken accessToken = client.getAccessToken();
    validateRole(accessToken);

    SynapseTokenData synapseTokenData = getSynapseTokenData();

    if (synapseTokenData == null || deviceId == null) {
      synapseTokenData = matrixLoginClient.login(accessToken, deviceId);
      storeSynapseTokenData(synapseTokenData);
    } else {
      if (tokenRefreshRequired(synapseTokenData)) {
        synapseTokenData = tryRefreshToken(synapseTokenData, accessToken);
        storeSynapseTokenData(synapseTokenData);
      }
    }
    return ResponseEntity.ok()
        .header(HttpHeaders.AUTHORIZATION, "Bearer " + synapseTokenData.accessToken())
        .build();
  }

  private static void validateRole(OAuth2AccessToken accessToken) {
    List<String> roles = RolesResolver.getRoles(accessToken);
    if (!roles.contains(EmployeePermissionRole.CHAT_USER.name())) {
      throw new ForbiddenException("Required role is missing");
    }
  }

  private SynapseTokenData getSynapseTokenData() {
    return synapseTokenDataHolder.getSynapseTokenData();
  }

  private void storeSynapseTokenData(SynapseTokenData synapseTokenData) {
    synapseTokenDataHolder.setSynapseTokenData(synapseTokenData);
  }

  private boolean tokenRefreshRequired(SynapseTokenData synapseTokenData) {
    Instant instantOfRequiredRefresh =
        synapseTokenData.expiresAt().minus(authProperties.synapse().refreshClockSkew());
    return Instant.now(clock).isAfter(instantOfRequiredRefresh);
  }

  private SynapseTokenData tryRefreshToken(
      SynapseTokenData synapseTokenData, OAuth2AccessToken accessToken) {
    try {
      return matrixRefreshClient.refresh(synapseTokenData);
    } catch (Exception ex) {
      log.error(
          "Failed to refresh AccessToken from Synapse server. Trying login for new AccessToken",
          ex);
      return matrixLoginClient.login(accessToken, synapseTokenData.deviceId());
    }
  }
}
