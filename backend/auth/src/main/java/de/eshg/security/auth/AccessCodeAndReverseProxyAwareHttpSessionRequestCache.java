/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.security.auth;

import static de.eshg.security.auth.login.AccessCodeLoginMethod.ACCESS_CODE_QUERY_PARAMETER;

import de.eshg.security.auth.login.AccessCodeLoginMethod;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.util.UriComponentsBuilder;

public class AccessCodeAndReverseProxyAwareHttpSessionRequestCache
    extends ReverseProxyAwareHttpSessionRequestCache {

  private static final Logger log =
      LoggerFactory.getLogger(AccessCodeAndReverseProxyAwareHttpSessionRequestCache.class);

  private final AccessCodeLoginMethod accessCodeLoginMethod;

  public AccessCodeAndReverseProxyAwareHttpSessionRequestCache(
      AccessCodeLoginMethod accessCodeLoginMethod) {
    this.accessCodeLoginMethod = accessCodeLoginMethod;
  }

  @Override
  protected UriComponentsBuilder buildNewRedirectUri(
      String previousRedirectUrl, String newRedirectUri) {
    UriComponentsBuilder newRedirectUriBuilder =
        super.buildNewRedirectUri(previousRedirectUrl, newRedirectUri);
    if (accessCodeLoginMethod.isApplicable(newRedirectUri)) {
      log.debug("Dropping {} query parameter from redirect URL", ACCESS_CODE_QUERY_PARAMETER);
      return newRedirectUriBuilder.replaceQueryParam(ACCESS_CODE_QUERY_PARAMETER);
    }
    return newRedirectUriBuilder;
  }
}
