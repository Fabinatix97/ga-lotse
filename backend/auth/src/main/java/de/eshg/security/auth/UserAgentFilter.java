/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.security.auth;

import de.cronn.commons.lang.AlphanumericComparator;
import de.eshg.security.auth.AuthProperties.UserAgentMinimumVersion;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Map;
import java.util.regex.Matcher;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.web.DefaultRedirectStrategy;
import org.springframework.security.web.RedirectStrategy;
import org.springframework.util.Assert;
import org.springframework.web.filter.OncePerRequestFilter;

public class UserAgentFilter extends OncePerRequestFilter {

  private static final Logger log = LoggerFactory.getLogger(UserAgentFilter.class);

  private final AuthProperties authProperties;
  private final RedirectStrategy redirectStrategy = new DefaultRedirectStrategy();

  public UserAgentFilter(AuthProperties authProperties) {
    this.authProperties = authProperties;
  }

  @Override
  protected void doFilterInternal(
      HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {
    String originalUri = request.getHeader(AuthController.X_ORIGINAL_URI_HEADER);

    String userAgent = request.getHeader(HttpHeaders.USER_AGENT);
    if (userAgent == null || userAgent.isBlank()) {
      log.error("User agent header is missing or blank");
      response.setStatus(HttpStatus.BAD_REQUEST.value());
      return;
    }

    if (!isUserAgentAllowed(userAgent)) {
      redirectStrategy.sendRedirect(
          request, response, authProperties.reverseProxy().url() + "/browser-aktualisieren");
      return;
    }
    filterChain.doFilter(request, response);
  }

  private boolean isUserAgentAllowed(String userAgent) {
    for (Map.Entry<String, UserAgentMinimumVersion> entry :
        authProperties.auth().userAgentFilter().allowed().entrySet()) {
      String browserKey = entry.getKey();
      UserAgentMinimumVersion userAgentMinimumVersion = entry.getValue();
      Matcher matcher = userAgentMinimumVersion.userAgentPattern().matcher(userAgent);
      if (matcher.matches()) {
        Assert.isTrue(
            matcher.groupCount() == 1,
            () ->
                "Unexpected number of matching groups for browser %s: %d"
                    .formatted(browserKey, matcher.groupCount()));
        String actualBrowserVersion = matcher.group(1);
        if (AlphanumericComparator.isAfterOrEqual(
            actualBrowserVersion, userAgentMinimumVersion.minimumVersion())) {
          log.debug(
              "Detected user agent that fulfills the minimum required version. Browser type: '{}'",
              browserKey);
          return true;
        } else {
          log.error(
              "User agent '{}' is too old: Actual browser version {}, minimum required version is {}",
              userAgent,
              actualBrowserVersion,
              userAgentMinimumVersion.minimumVersion());
          return false;
        }
      }
    }

    log.error("User agent '{}' did not match any allowed user agent", userAgent);
    return false;
  }
}
