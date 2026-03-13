/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.filejockey;

import static jakarta.servlet.http.HttpServletResponse.SC_LENGTH_REQUIRED;
import static jakarta.servlet.http.HttpServletResponse.SC_REQUEST_ENTITY_TOO_LARGE;
import static org.springframework.http.HttpMethod.PATCH;
import static org.springframework.http.HttpMethod.POST;
import static org.springframework.http.HttpMethod.PUT;

import de.eshg.filejockey.config.FileJockeyProperties;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Set;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class MaxRequestSizeFilter extends OncePerRequestFilter {

  private static final Set<String> MODIFYING_HTTP_METHODS =
      Set.of(POST.name(), PUT.name(), PATCH.name());

  private final long maxRequestSizeBytes;

  public MaxRequestSizeFilter(FileJockeyProperties fileJockeyProperties) {
    this.maxRequestSizeBytes = fileJockeyProperties.maxRequestSize.toBytes();
  }

  @Override
  protected boolean shouldNotFilter(HttpServletRequest request) {
    return !MODIFYING_HTTP_METHODS.contains(request.getMethod());
  }

  @Override
  protected void doFilterInternal(
      HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {

    long contentLength = request.getContentLengthLong(); // -1 when unknown

    if (contentLength < 0) {
      response.setStatus(SC_LENGTH_REQUIRED);
    } else if (contentLength > maxRequestSizeBytes) {
      response.setStatus(SC_REQUEST_ENTITY_TOO_LARGE);
    } else {
      filterChain.doFilter(request, response);
    }
  }
}
