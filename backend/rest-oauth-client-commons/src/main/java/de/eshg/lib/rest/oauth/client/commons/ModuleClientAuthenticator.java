/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.rest.oauth.client.commons;

import de.cronn.commons.lang.Action;
import java.util.Optional;
import java.util.function.Supplier;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.context.SecurityContextHolderStrategy;
import org.springframework.security.oauth2.client.AuthorizedClientServiceOAuth2AuthorizedClientManager;
import org.springframework.security.oauth2.client.OAuth2AuthorizeRequest;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.server.resource.authentication.BearerTokenAuthenticationToken;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationProvider;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;

/**
 * {@link ModuleClientAuthenticator} allows running code as the authenticated module client. It
 * obtains a token for the oauth client of the module ({@code module-client}) using the client
 * credentials flow. This token is passed to the module's own JwtAuthenticationProvider, s.t. roles
 * and user id are parsed from the token
 *
 * <p>In {@link ModuleClientAuthenticator#doWithModuleClientAuthentication(Action)}} the security
 * context is set during the execution of the given action. See {@link
 * ModuleClientAuthenticator#doWithModuleClientAuthentication(Supplier)} for a function with return
 * value.
 *
 * <p>Note: Inside a transaction, e.g. using {@link
 * org.springframework.transaction.annotation.Transactional}, the security context will be cleared
 * before the transaction is committed.
 */
@Component
public final class ModuleClientAuthenticator {

  private static final String CLIENT_REGISTRATION_ID = "module-client";

  private final AuthorizedClientServiceOAuth2AuthorizedClientManager authorizedClientManager;
  private final SecurityContextHolderStrategy securityContextHolderStrategy =
      SecurityContextHolder.getContextHolderStrategy();
  private final JwtAuthenticationProvider jwtAuthenticationProvider;

  public ModuleClientAuthenticator(
      ClientRegistrationRepository clientRegistrationRepository,
      OAuth2AuthorizedClientService oAuth2AuthorizedClientService,
      JwtAuthenticationProvider employeePortalAuthenticationProvider) {
    this.jwtAuthenticationProvider = employeePortalAuthenticationProvider;

    authorizedClientManager =
        new AuthorizedClientServiceOAuth2AuthorizedClientManager(
            clientRegistrationRepository, oAuth2AuthorizedClientService);
  }

  public void doWithModuleClientAuthentication(Action action) {
    doWithModuleClientAuthentication(action.toSupplier());
  }

  public <T> T doWithModuleClientAuthentication(Supplier<T> supplier) {
    validateCurrentContextIsUnauthenticated();

    Authentication authentication = authenticateModuleClient();
    SecurityContext moduleClientSecurityContext = createSecurityContext(authentication);
    try {
      securityContextHolderStrategy.setContext(moduleClientSecurityContext);
      return supplier.get();
    } finally {
      securityContextHolderStrategy.clearContext();
    }
  }

  public void doWithReplacedModuleClientAuthentication(Action action) {
    doWithReplacedModuleClientAuthentication(action.toSupplier());
  }

  public <T> T doWithReplacedModuleClientAuthentication(Supplier<T> supplier) {
    validateCurrentContextIsAuthenticated();

    Authentication authentication = authenticateModuleClient();
    SecurityContext moduleClientSecurityContext = createSecurityContext(authentication);

    SecurityContext oldContext = securityContextHolderStrategy.getContext();
    try {
      securityContextHolderStrategy.setContext(moduleClientSecurityContext);
      return supplier.get();
    } finally {
      securityContextHolderStrategy.setContext(oldContext);
    }
  }

  private SecurityContext createSecurityContext(Authentication authentication) {
    SecurityContext moduleClientAuthenticatedContext =
        securityContextHolderStrategy.createEmptyContext();
    moduleClientAuthenticatedContext.setAuthentication(authentication);
    return moduleClientAuthenticatedContext;
  }

  private Authentication authenticateModuleClient() {
    OAuth2AuthorizedClient authorizedClient = obtainAuthorizedModuleClient();
    return authenticate(authorizedClient);
  }

  private Authentication authenticate(OAuth2AuthorizedClient authorizedClient) {
    BearerTokenAuthenticationToken bearerTokenAuthenticationToken =
        new BearerTokenAuthenticationToken(authorizedClient.getAccessToken().getTokenValue());
    return jwtAuthenticationProvider.authenticate(bearerTokenAuthenticationToken);
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
