/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.security.auth.login;

import com.google.common.collect.Iterables;
import de.eshg.security.auth.SecFetchHeaderUtil;
import de.eshg.security.auth.SecFetchMode;
import de.eshg.security.auth.SecFetchSite;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Objects;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.security.oauth2.client.OAuth2ClientProperties;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizedClientRepository;
import org.springframework.security.oauth2.core.OAuth2RefreshToken;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;

@Component
public class KeycloakLogoutHelper {

  private static final Logger log = LoggerFactory.getLogger(KeycloakLogoutHelper.class);

  private final OAuth2AuthorizedClientRepository authorizedClientRepository;
  private final RestClient keycloakLogoutClient;

  KeycloakLogoutHelper(
      OAuth2AuthorizedClientRepository authorizedClientRepository,
      OAuth2ClientProperties oAuth2ClientProperties,
      ClientRegistrationRepository clientRegistrationRepository,
      RestClient.Builder restClientBuilder) {
    this.authorizedClientRepository = authorizedClientRepository;
    this.keycloakLogoutClient =
        restClientBuilder
            .baseUrl(getLogoutUrl(oAuth2ClientProperties, clientRegistrationRepository))
            .build();
  }

  private static String getLogoutUrl(
      OAuth2ClientProperties oAuth2ClientProperties,
      ClientRegistrationRepository clientRegistrationRepository) {
    String oauthProvider =
        Iterables.getOnlyElement(oAuth2ClientProperties.getRegistration().keySet());

    ClientRegistration clientRegistration =
        clientRegistrationRepository.findByRegistrationId(oauthProvider);

    String tokenUri = clientRegistration.getProviderDetails().getTokenUri();
    Assert.isTrue(
        tokenUri.endsWith("/openid-connect/token"),
        () -> "Unexpected token URI: %s".formatted(tokenUri));
    return tokenUri.replace("/openid-connect/token", "/openid-connect/logout");
  }

  void executeOpenIdConnectLogout(HttpServletRequest request) {
    SecFetchHeaderUtil.verifySecFetchModeHeader(request, SecFetchMode.NAVIGATE);
    SecFetchHeaderUtil.verifySecFetchSiteHeader(
        request, SecFetchSite.NONE, SecFetchSite.SAME_ORIGIN);

    log.info("Executing OIDC logout in Keycloak");

    ResponseEntity<Void> response =
        keycloakLogoutClient
            .post()
            .contentType(MediaType.APPLICATION_FORM_URLENCODED)
            .body(buildLogoutRequest(request))
            .retrieve()
            .toBodilessEntity();

    if (response.getStatusCode().is2xxSuccessful()) {
      log.info("Successfully logged out in Keycloak ({})", response.getStatusCode());
    } else {
      log.error("Failed to logout in Keycloak: {}", response.getStatusCode());
    }
  }

  private MultiValueMap<String, String> buildLogoutRequest(HttpServletRequest request) {
    OAuth2AuthenticationToken oauthToken =
        (OAuth2AuthenticationToken) SecurityContextHolder.getContext().getAuthentication();

    String clientRegistrationId = oauthToken.getAuthorizedClientRegistrationId();

    OAuth2AuthorizedClient client =
        authorizedClientRepository.loadAuthorizedClient(clientRegistrationId, oauthToken, request);
    OAuth2RefreshToken refreshToken =
        Objects.requireNonNull(client.getRefreshToken(), "Refresh token expected");

    MultiValueMap<String, String> logoutRequest = new LinkedMultiValueMap<>();
    logoutRequest.add("client_id", client.getClientRegistration().getClientId());
    logoutRequest.add("client_secret", client.getClientRegistration().getClientSecret());
    logoutRequest.add("refresh_token", refreshToken.getTokenValue());
    return logoutRequest;
  }
}
