/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.commons.filter;

import de.eshg.testhelper.ConditionalOnTestHelperEnabled;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
@ConditionalOnTestHelperEnabled
@Order(FilterOrder.ACTIVE_REQUEST_COUNTER_FILTER_ORDER)
public class ActiveRequestCounterFilter extends OncePerRequestFilter {

  private static final Logger log = LoggerFactory.getLogger(ActiveRequestCounterFilter.class);

  private final ActiveRequestCounter activeRequestCounter;

  public ActiveRequestCounterFilter(ActiveRequestCounter activeRequestCounter) {
    log.warn("Creating {}", getClass().getSimpleName());
    this.activeRequestCounter = activeRequestCounter;
  }

  @Override
  protected void doFilterInternal(
      @NotNull HttpServletRequest request,
      @NotNull HttpServletResponse response,
      @NotNull FilterChain filterChain)
      throws ServletException, IOException {
    activeRequestCounter.start();
    log.trace(
        "Started active request counter for {} {}", request.getMethod(), request.getRequestURI());
    try {
      filterChain.doFilter(request, response);
    } finally {
      log.trace(
          "Finishing active request counter for {} {}",
          request.getMethod(),
          request.getRequestURI());
      activeRequestCounter.finish();
    }
  }
}
