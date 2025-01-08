/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.Closeable;
import java.io.IOException;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.web.filter.OncePerRequestFilter;

public class UserSessionIdLoggingFilter extends OncePerRequestFilter {
  private static final Logger log = LoggerFactory.getLogger(UserSessionIdLoggingFilter.class);

  private static final int SESSION_ID_TRUNCATION_LENGTH = "aaaaaaaa-bbbb".length();

  @Override
  protected void doFilterInternal(
      HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {
    String userSessionId =
        CurrentUserHelper.getCurrentUserSessionIdGracefully()
            .map(UserSessionIdLoggingFilter::truncateUuid)
            .orElse(null);
    try (Closeable closeable = putCloseableIfNotNull("userSessionId", userSessionId)) {
      log.trace("{}", closeable);
      filterChain.doFilter(request, response);
    }
  }

  // For security reasons we truncate the UUID from "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee" to
  // "aaaaaaaa-bbbb"
  private static String truncateUuid(String sessionId) {
    return StringUtils.left(sessionId, SESSION_ID_TRUNCATION_LENGTH) + "…";
  }

  private static Closeable putCloseableIfNotNull(String key, String value) {
    if (value == null) {
      return () -> {};
    }
    return MDC.putCloseable(key, value);
  }
}
