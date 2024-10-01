/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.commons.filter;

import de.eshg.logging.LoggingConstants;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.Closeable;
import java.io.IOException;
import java.util.Objects;
import java.util.stream.Collectors;
import org.jetbrains.annotations.VisibleForTesting;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.boot.actuate.autoconfigure.endpoint.web.WebEndpointProperties;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

/**
 * This filter logs essential information about incoming HTTP requests to the regular log file,
 * supplementing the detailed logging provided by Logbook (configured for debug-level in
 * production).
 *
 * <p>It logs the HTTP method, URI, and response status of requests to help trace request processing
 * without needing extensive debug logs.
 *
 * <p>The filter is configured with the highest precedence to ensure it logs requests before Spring
 * Security filters.
 */
@Component
@Order(FilterOrder.REQUEST_LOGGING_FILTER_ORDER)
public class RequestLoggingFilter extends OncePerRequestFilter {

  private static final Logger log = LoggerFactory.getLogger(RequestLoggingFilter.class);

  private final String actuatorBasePath;

  public RequestLoggingFilter(WebEndpointProperties webEndpointProperties) {
    this.actuatorBasePath = webEndpointProperties.getBasePath();
  }

  @Override
  protected void doFilterInternal(
      HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {
    if (request.getRequestURI().startsWith(actuatorBasePath + "/")) {
      // Do not log calls to the actuator endpoint
      filterChain.doFilter(request, response);
      return;
    }
    try (Closeable closeable = putCorrelationIdToMdc(request)) {
      log.trace("{}", closeable);
      try {
        log.info(
            "Starting to process {} {}{}",
            request.getMethod(),
            request.getRequestURI(),
            maskedQueryString(request.getQueryString()));

        filterChain.doFilter(request, response);
      } finally {
        log.info(
            "Processed {} {} with result {}",
            request.getMethod(),
            request.getRequestURI(),
            HttpStatus.valueOf(response.getStatus()));
      }
    }
  }

  private static Closeable putCorrelationIdToMdc(HttpServletRequest request) {
    String correlationId = request.getHeader(LoggingConstants.CORRELATION_ID_HEADER);
    if (correlationId == null) {
      return () -> {};
    }
    return MDC.putCloseable(LoggingConstants.CORRELATION_ID_MDC_KEY, correlationId);
  }

  @VisibleForTesting
  static String maskedQueryString(String queryString) {
    if (queryString == null || queryString.isBlank()) {
      return "";
    }
    UriComponents uriComponents = UriComponentsBuilder.newInstance().query(queryString).build();
    return uriComponents.getQueryParams().entrySet().stream()
        .map(
            entry -> {
              if (entry.getValue().stream().allMatch(Objects::isNull)) {
                return entry.getKey();
              }
              return "%s=[MASKED]".formatted(entry.getKey());
            })
        .collect(Collectors.joining("&", "?", ""));
  }
}
