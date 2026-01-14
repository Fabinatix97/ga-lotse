/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.security.auth;

import de.eshg.security.auth.login.AccessCodeLoginMethod;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

@Component
public final class ReverseProxyAwareSavedRequestAwareAuthenticationSuccessHandler
    extends SavedRequestAwareAuthenticationSuccessHandler {

  public ReverseProxyAwareSavedRequestAwareAuthenticationSuccessHandler(
      AccessCodeLoginMethod accessCodeLoginMethod) {
    setRequestCache(
        new AccessCodeAndReverseProxyAwareHttpSessionRequestCache(accessCodeLoginMethod));
  }
}
