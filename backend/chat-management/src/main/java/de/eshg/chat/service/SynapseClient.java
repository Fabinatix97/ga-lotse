/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.chat.service;

import static de.eshg.chat.ChatManagementApplication.SYNAPSE_REST_TEMPLATE;
import static de.eshg.chat.service.RestUtils.getResponseBody;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;
import static org.springframework.web.util.UriComponentsBuilder.fromPath;

import de.eshg.chat.SynapseProperties;
import de.eshg.chat.model.synapse.*;
import de.eshg.rest.service.error.BadRequestException;
import jakarta.annotation.PostConstruct;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.*;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.apache.commons.codec.binary.Hex;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.retry.support.RetryTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class SynapseClient {

  private static final Logger log = LoggerFactory.getLogger(SynapseClient.class);

  private final SynapseProperties synapseProperties;

  private final RestTemplate synapseRestTemplate;

  private final SynapseAuthenticationService synapseAuthService;

  private final RetryTemplate retryTemplate =
      RetryTemplate.builder()
          .maxAttempts(6)
          .exponentialBackoff(500, 2, 10000)
          .retryOn(Exception.class)
          .build();

  @PostConstruct
  public void createSynapseAdminAccount() {
    try {
      log.info("Creating Admin account.");
      createUser(synapseProperties.admin().name(), synapseProperties.admin().password(), true);
    } catch (BadRequestException ex) {
      if (ex.getClientVisibleMessage() != null
          && ex.getClientVisibleMessage().contains("User ID already taken")) {
        log.info("Admin account already created.");
      } else throw ex;
    }
  }

  public SynapseClient(
      @Autowired SynapseAuthenticationService synapseAuthenticationService,
      @Autowired @Qualifier(SYNAPSE_REST_TEMPLATE) RestTemplate synapseRestTemplate,
      @Autowired SynapseProperties synapseProperties) {
    this.synapseRestTemplate = synapseRestTemplate;
    this.synapseAuthService = synapseAuthenticationService;
    this.synapseProperties = synapseProperties;
  }

  public CreateUserResponse createUser(String username, String password, Boolean admin) {
    try {
      String nonce = getNonce();
      String hmacSHA1 =
          generateHmacSha1(
              nonce, username, password, Boolean.TRUE.equals(admin) ? "admin" : "notadmin");
      CreateUserRequest createUserRequest =
          new CreateUserRequest()
              .username(username)
              .displayname(username)
              .password(password)
              .nonce(nonce)
              .admin(admin)
              .mac(hmacSHA1);

      ResponseEntity<CreateUserResponse> response =
          synapseRestTemplate.exchange(
              resolveUrl("/_synapse/admin/v1/register"),
              HttpMethod.POST,
              unauthenticatedRequest(createUserRequest),
              CreateUserResponse.class);
      return getResponseBody(response);
    } catch (Exception e) {
      throw new BadRequestException(e.getMessage());
    }
  }

  public void bindKeycloakId(String matrixUserId, String keycloakUserId) {
    try {
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
      SetExternalIdRequest request =
          new SetExternalIdRequest().externalIds(Collections.emptyList());

      updateMatrixUser(matrixUserId, request);
    } catch (Exception ex) {
      throw new BadRequestException(ex.getMessage());
    }
  }

  public void deactivateUserAccount(String matrixUserId) {
    try {
      retryTemplate.execute(
          retryContext -> {
            if (retryContext.getRetryCount() > 0) {
              log.error(
                  "Retry to deactivate user account because of an error",
                  retryContext.getLastThrowable());
            }
            return synapseRestTemplate.exchange(
                resolveUrl(
                    fromPath("/_synapse/admin/v1/deactivate/{matrixUserId}")
                        .buildAndExpand(matrixUserId)
                        .toUriString()),
                HttpMethod.POST,
                authenticatedRequest(),
                Void.class);
          });
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
            return synapseRestTemplate.exchange(
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

  public String getNonce() {

    try {
      ResponseEntity<Nonce> response =
          synapseRestTemplate.exchange(
              resolveUrl("/_synapse/admin/v1/register"),
              HttpMethod.GET,
              unauthenticatedRequest(),
              Nonce.class);
      return getResponseBody(response).nonce();
    } catch (Exception e) {
      throw new BadRequestException(e.getMessage());
    }
  }

  private String generateHmacSha1(String nonce, String username, String password, String admin) {
    try {
      String message = String.join("\0", nonce, username, password, admin);
      SecretKeySpec keySpec =
          new SecretKeySpec(synapseProperties.registrationSharedSecret().getBytes(), "HmacSHA1");
      Mac mac = Mac.getInstance("HmacSHA1");
      mac.init(keySpec);
      return Hex.encodeHexString(mac.doFinal(message.getBytes()));
    } catch (NoSuchAlgorithmException | InvalidKeyException e) {
      throw new RuntimeException(e);
    }
  }

  private String resolveUrl(String url) {
    return synapseProperties.internal().url() + url;
  }

  private <T> HttpEntity<T> unauthenticatedRequest() {
    return unauthenticatedRequest(null);
  }

  private <T> HttpEntity<T> unauthenticatedRequest(T requestBody) {
    return new HttpEntity<>(requestBody, createHeaders());
  }

  private <T> HttpEntity<T> authenticatedRequest() {
    return authenticatedRequest(null);
  }

  private <T> HttpEntity<T> authenticatedRequest(T requestBody) {
    return new HttpEntity<>(requestBody, setAuthHeader(createHeaders()));
  }

  private HttpHeaders createHeaders() {
    HttpHeaders headers = new HttpHeaders();
    headers.set("Content-Type", APPLICATION_JSON_VALUE);
    headers.set("Accept", APPLICATION_JSON_VALUE);
    return headers;
  }

  private HttpHeaders setAuthHeader(HttpHeaders headers) {
    headers.set("Authorization", "Bearer " + synapseAuthService.getAccessToken());
    return headers;
  }
}
