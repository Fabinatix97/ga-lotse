/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.commons.logging;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * This filter executes the writing of the response log. The writing is deferred to have all
 * available headers, added by other filters, to be logged, too. At this point however, we do not
 * have access to the deserialized body, thus we must pass it in the {@link
 * LoggingResponseBodyAdvice}.
 */
@Order(Ordered.HIGHEST_PRECEDENCE)
public class LoggingFilter extends OncePerRequestFilter {

  private final FilteringLogbookAdapter eshgLogBookAdapter;

  public LoggingFilter(FilteringLogbookAdapter eshgLogBookAdapter) {
    this.eshgLogBookAdapter = eshgLogBookAdapter;
  }

  @Override
  protected void doFilterInternal(
      HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {
    filterChain.doFilter(request, response);
    eshgLogBookAdapter.handleFinalizedResponse(request, response);
  }
}
