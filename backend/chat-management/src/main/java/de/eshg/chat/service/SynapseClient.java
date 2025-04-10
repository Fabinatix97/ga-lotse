/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.chat.service;

import static de.eshg.chat.ChatManagementApplication.SYNAPSE_REST_TEMPLATE;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;
import static org.springframework.web.util.UriComponentsBuilder.fromPath;

import de.eshg.chat.SynapseProperties;
import de.eshg.chat.model.synapse.*;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.security.CurrentUserHelper;
import java.util.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.retry.support.RetryTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class SynapseClient {

  private static final Logger log = LoggerFactory.getLogger(SynapseClient.class);

  private final SynapseProperties synapseProperties;

  private final RestTemplate restTemplate;

  private final SynapseAuthenticationService synapseAuthService;

  private final RetryTemplate retryTemplate =
      RetryTemplate.builder()
          .maxAttempts(5)
          .exponentialBackoff(1000, 2, 10000)
          .retryOn(Exception.class)
          .build();

  private SynapseClient(
      @Autowired SynapseAuthenticationService synapseAuthenticationService,
      @Autowired @Qualifier(SYNAPSE_REST_TEMPLATE) RestTemplate synapseRestTemplate,
      @Autowired SynapseProperties synapseProperties) {
    this.restTemplate = synapseRestTemplate;
    this.synapseAuthService = synapseAuthenticationService;
    this.synapseProperties = synapseProperties;
  }

  public void bindKeycloakId(String matrixUserId) {
    try {
      String keycloakUserId = CurrentUserHelper.getCurrentUserId().toString();
      validateIfLoggedMxidBelongsToLoggedInUser(keycloakUserId, matrixUserId);

      SetExternalIdRequest request =
          new SetExternalIdRequest()
              .externalIds(
                  List.of(
                      new ExternalIdMapping()
                          .externalId(keycloakUserId)
                          .authProvider("oidc-keycloak")));

      updateMatrixUser(matrixUserId, request);
    } catch (Exception ex) {
      throw new BadRequestException(ex.getMessage());
    }
  }

  public void unbindKeycloakId(String matrixUserId) {
    try {
      String keycloakUserId = CurrentUserHelper.getCurrentUserId().toString();
      validateIfLoggedMxidBelongsToLoggedInUser(keycloakUserId, matrixUserId);

      SetExternalIdRequest request =
          new SetExternalIdRequest().externalIds(Collections.emptyList());

      updateMatrixUser(matrixUserId, request);
    } catch (Exception ex) {
      throw new BadRequestException(ex.getMessage());
    }
  }

  private <T> void updateMatrixUser(String matrixUserId, T requestBody) {
    try {
      retryTemplate.execute(
          retryContext -> {
            if (retryContext.getRetryCount() > 0) {
              log.error(
                  "Retry to bindKeycloakId because of an error", retryContext.getLastThrowable());
            }
            return restTemplate.exchange(
                resolveUrl(
                    fromPath("/_synapse/admin/v2/users/{matrixUserId}")
                        .buildAndExpand(matrixUserId)
                        .toUriString()),
                HttpMethod.PUT,
                authenticatedRequest(requestBody),
                Void.class);
          });
    } catch (Exception ex) {
      throw new BadRequestException(ex.getMessage());
    }
  }

  private void validateIfLoggedMxidBelongsToLoggedInUser(
      String actualKeycloakUserId, String matrixUserId) {
    String keycloakUserIdFromMXID = extractMXIDLocalpart(matrixUserId);
    if (!actualKeycloakUserId.equals(keycloakUserIdFromMXID)) {
      throw new IllegalArgumentException(
          String.format(
              "Failed to bindKeycloakId, matrixUserId localpart '%s' is not matching logged-in user keycloakId '%s",
              matrixUserId, actualKeycloakUserId));
    }
  }

  private String extractMXIDLocalpart(String matrixUserId) {
    return matrixUserId.substring(1).split(":")[0];
  }

  private String resolveUrl(String url) {
    return synapseProperties.internal().url() + url;
  }

  private <T> HttpEntity<T> authenticatedRequest() {
    return authenticatedRequest(null);
  }

  private <T> HttpEntity<T> authenticatedRequest(T requestBody) {
    return new HttpEntity<>(requestBody, createHeaders());
  }

  private HttpHeaders createHeaders() {
    HttpHeaders headers = new HttpHeaders();
    headers.set("Authorization", "Bearer " + synapseAuthService.getAccessToken());
    headers.set("Content-Type", APPLICATION_JSON_VALUE);
    headers.set("Accept", APPLICATION_JSON_VALUE);
    return headers;
  }
}
