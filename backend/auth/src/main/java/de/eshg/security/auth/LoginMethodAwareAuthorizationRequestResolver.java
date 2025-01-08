/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.security.auth;

import de.eshg.security.auth.login.LoginMethod;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.DefaultOAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizationRequestCustomizers;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;
import org.springframework.security.web.savedrequest.RequestCache;
import org.springframework.security.web.savedrequest.SavedRequest;

public class LoginMethodAwareAuthorizationRequestResolver
    implements OAuth2AuthorizationRequestResolver {
  private final OAuth2AuthorizationRequestResolver delegate;
  private final RequestCache requestCache = new ReverseProxyAwareHttpSessionRequestCache();
  private final List<LoginMethod> loginMethods;

  public LoginMethodAwareAuthorizationRequestResolver(
      ClientRegistrationRepository clientRegistrationRepository,
      List<LoginMethod> loginMethods,
      String authorizationRequestBaseUri) {
    this.loginMethods = loginMethods;
    this.delegate = buildRequestResolver(clientRegistrationRepository, authorizationRequestBaseUri);
  }

  private static OAuth2AuthorizationRequestResolver buildRequestResolver(
      ClientRegistrationRepository clientRegistrationRepository,
      String authorizationRequestBaseUri) {
    DefaultOAuth2AuthorizationRequestResolver requestResolver =
        new DefaultOAuth2AuthorizationRequestResolver(
            clientRegistrationRepository, authorizationRequestBaseUri);
    requestResolver.setAuthorizationRequestCustomizer(
        OAuth2AuthorizationRequestCustomizers.withPkce());
    return requestResolver;
  }

  @Override
  public OAuth2AuthorizationRequest resolve(HttpServletRequest request) {
    OAuth2AuthorizationRequest authorizationRequest = delegate.resolve(request);
    if (authorizationRequest == null) {
      return null;
    }

    SavedRequest savedRequest = requestCache.getRequest(request, null);
    if (savedRequest == null) {
      return authorizationRequest;
    }
    String redirectUrl = savedRequest.getRedirectUrl();

    for (LoginMethod loginMethod : loginMethods) {
      if (loginMethod.isApplicable(redirectUrl)) {
        return loginMethod.apply(authorizationRequest, redirectUrl);
      }
    }

    return authorizationRequest;
  }

  @Override
  public OAuth2AuthorizationRequest resolve(
      HttpServletRequest request, String clientRegistrationId) {
    return delegate.resolve(request, clientRegistrationId);
  }
}
