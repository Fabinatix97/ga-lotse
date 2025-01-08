/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.rest.oauth.client.commons;

import com.nimbusds.jwt.JWTParser;
import de.cronn.commons.lang.Action;
import de.eshg.rest.client.ModuleClientAuthentication;
import de.eshg.rest.client.ModuleClientAuthenticationHolder;
import java.text.ParseException;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Supplier;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.context.SecurityContextHolderStrategy;
import org.springframework.security.oauth2.client.AuthorizedClientServiceOAuth2AuthorizedClientManager;
import org.springframework.security.oauth2.client.OAuth2AuthorizeRequest;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;

/**
 * {@link ModuleClientAuthenticator} allows running code as the authenticated module client. It
 * obtains a token for the oauth client of the module ({@code module-client}) using the client
 * credentials flow. This token is passed to the {@link ModuleClientAuthenticationHolder} and taken
 * from there during user id or access token resolving.
 *
 * <p>In {@link ModuleClientAuthenticator#doWithModuleClientAuthentication(Action)}} module client
 * is saved to {@link ModuleClientAuthenticationHolder} during the execution of the given action.
 * See {@link ModuleClientAuthenticator#doWithModuleClientAuthentication(Supplier)} for a function
 * with return value.
 *
 * <p>Note: Inside a transaction, e.g. using {@link
 * org.springframework.transaction.annotation.Transactional}, the security context will be cleared
 * before the transaction is committed.
 */
@Component
public class ModuleClientAuthenticator {

  private static final String CLIENT_REGISTRATION_ID = "module-client";

  private final AuthorizedClientServiceOAuth2AuthorizedClientManager authorizedClientManager;
  private final SecurityContextHolderStrategy securityContextHolderStrategy =
      SecurityContextHolder.getContextHolderStrategy();

  public ModuleClientAuthenticator(
      ClientRegistrationRepository clientRegistrationRepository,
      OAuth2AuthorizedClientService oAuth2AuthorizedClientService) {

    authorizedClientManager =
        new AuthorizedClientServiceOAuth2AuthorizedClientManager(
            clientRegistrationRepository, oAuth2AuthorizedClientService);
  }

  public void doWithModuleClientAuthentication(Action action) {
    doWithModuleClientAuthentication(action.toSupplier());
  }

  public <T> T doWithModuleClientAuthentication(Supplier<T> supplier) {
    validateCurrentContextIsUnauthenticated();
    return executeWithModuleClientAuthentication(supplier);
  }

  public void doWithReplacedModuleClientAuthentication(Action action) {
    doWithReplacedModuleClientAuthentication(action.toSupplier());
  }

  public <T> T doWithReplacedModuleClientAuthentication(Supplier<T> supplier) {
    validateCurrentContextIsAuthenticated();
    return executeWithModuleClientAuthentication(supplier);
  }

  private <T> T executeWithModuleClientAuthentication(Supplier<T> supplier) {
    ModuleClientAuthentication moduleClientAuthentication = authenticate();
    try {
      ModuleClientAuthenticationHolder.setModuleClientAuthentication(moduleClientAuthentication);
      return supplier.get();
    } finally {
      ModuleClientAuthenticationHolder.clearModuleClientAuthentication();
    }
  }

  private ModuleClientAuthentication authenticate() {
    OAuth2AuthorizedClient authorizedClient = obtainAuthorizedModuleClient();
    return toModuleClientAuthentication(authorizedClient);
  }

  private ModuleClientAuthentication toModuleClientAuthentication(
      OAuth2AuthorizedClient authorizedClient) {
    String accessToken = authorizedClient.getAccessToken().getTokenValue();
    return new ModuleClientAuthentication(parseUserId(accessToken), accessToken);
  }

  private UUID parseUserId(String tokenValue) {
    try {
      String subject = JWTParser.parse(tokenValue).getJWTClaimsSet().getSubject();
      return UUID.fromString(subject);
    } catch (ParseException e) {
      throw new IllegalStateException("Failed to parse JWT token", e);
    }
  }

  private OAuth2AuthorizedClient obtainAuthorizedModuleClient() {
    OAuth2AuthorizeRequest oAuth2AuthorizeRequest =
        OAuth2AuthorizeRequest.withClientRegistrationId(CLIENT_REGISTRATION_ID)
            .principal(CLIENT_REGISTRATION_ID)
            .build();

    OAuth2AuthorizedClient authorizedClient =
        authorizedClientManager.authorize(oAuth2AuthorizeRequest);
    Assert.notNull(authorizedClient, "Failed to authorize client");
    return authorizedClient;
  }

  private void validateCurrentContextIsAuthenticated() {
    Assert.isTrue(isAuthenticated(), "Security context should exist");
  }

  private void validateCurrentContextIsUnauthenticated() {
    Assert.isTrue(!isAuthenticated(), "No security context should exist");
  }

  private boolean isAuthenticated() {
    return Optional.ofNullable(securityContextHolderStrategy.getContext())
        .map(SecurityContext::getAuthentication)
        .isPresent();
  }
}
