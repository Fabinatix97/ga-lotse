/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lsd.register.api;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import java.util.Map;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;

/** RFC-8693 OAuth 2.0 Token Exchange client */
public class KeycloakAccessTokenClient {

  private final RestClient restClient;
  private final MultiValueMap<String, String> formData;

  public KeycloakAccessTokenClient(
      RestClient.Builder restClientBuilder, LsdKeycloakProperties properties) {
    restClient =
        restClientBuilder
            .baseUrl(properties.client().url() + "/realms/{realm}/protocol/openid-connect/token")
            .defaultUriVariables(Map.of("realm", properties.client().realm()))
            .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_FORM_URLENCODED_VALUE)
            .defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
            .defaultRequest(
                request ->
                    request.httpRequest(
                        httpRequest ->
                            httpRequest
                                .getHeaders()
                                .setBasicAuth(
                                    properties.client().clientId(),
                                    properties.client().clientSecret())))
            .build();
    formData = new LinkedMultiValueMap<>();
    formData.add("grant_type", "password");
    formData.add("username", properties.actor().user());
    formData.add("password", properties.actor().password());
  }

  public oAuth2TokenResponse getAccessToken() {
    return restClient.post().body(formData).retrieve().body(oAuth2TokenResponse.class);
  }

  @JsonIgnoreProperties(ignoreUnknown = true)
  public record oAuth2TokenResponse(
      @NotNull @JsonProperty("access_token") String accessToken,
      @NotNull @JsonProperty("issued_token_type") String issuedTokenType,
      @NotNull @JsonProperty("token_type") String tokenType,
      @JsonProperty("expires_in") Long expiresIn,
      @JsonProperty("scope") String scope,
      @JsonProperty("refresh_token") String refreshToken) {}
}
