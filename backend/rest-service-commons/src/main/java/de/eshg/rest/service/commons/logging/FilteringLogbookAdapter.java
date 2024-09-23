/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.commons.logging;

import de.eshg.rest.service.commons.logging.filter.MaskingRequestFilter;
import de.eshg.rest.service.commons.logging.filter.MaskingResponseFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Optional;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.MethodParameter;
import org.springframework.core.annotation.AnnotatedMethod;
import org.springframework.stereotype.Component;
import org.zalando.logbook.Logbook;
import org.zalando.logbook.Logbook.ResponseProcessingStage;
import org.zalando.logbook.Logbook.ResponseWritingStage;

@Component
public class FilteringLogbookAdapter {

  private final String responseWritingStageName =
      FilteringLogbookAdapter.class.getName() + "-WRITING" + UUID.randomUUID();
  private final String responseProcessingStageName =
      FilteringLogbookAdapter.class.getName() + "-PROCESSING" + UUID.randomUUID();

  private static final Logger log = LoggerFactory.getLogger(FilteringLogbookAdapter.class);

  private final Logbook logbook;
  private final MaskingRequestFilter maskingRequestFilter;
  private final MaskingResponseFilter maskingResponseFilter;

  public FilteringLogbookAdapter(
      Logbook logbook,
      MaskingRequestFilter maskingRequestFilter,
      MaskingResponseFilter maskingResponseFilter) {
    this.logbook = logbook;
    this.maskingRequestFilter = maskingRequestFilter;
    this.maskingResponseFilter = maskingResponseFilter;
  }

  public void handleRequest(HttpServletRequest request, AnnotatedMethod annotatedMethod) {
    handleRequest(request, null, annotatedMethod);
  }

  public void handleRequest(HttpServletRequest request, MethodParameter parameter) {
    handleRequest(request, null, parameter);
  }

  public void handleRequest(
      HttpServletRequest request, Object body, MethodParameter methodParameter) {
    handleRequest(request, body, getParentAnnotatedMethod(methodParameter));
  }

  private void handleRequest(
      HttpServletRequest request, Object body, AnnotatedMethod annotatedMethod) {
    try {
      ResponseProcessingStage responseProcessingStage =
          processRequest(request, body, annotatedMethod);
      request.setAttribute(responseProcessingStageName, responseProcessingStage);
    } catch (Exception e) {
      log.warn("Failed to log request", e);
    }
  }

  public void handleResponse(
      HttpServletRequest servletRequest, HttpServletResponse servletResponse, Object body) {
    try {
      ResponseWritingStage responseWritingStage =
          processResponse(servletRequest, servletResponse, body);
      servletRequest.setAttribute(responseWritingStageName, responseWritingStage);
    } catch (Exception e) {
      log.warn("Failed to log response", e);
    }
  }

  public void handleFinalizedResponse(HttpServletRequest request, HttpServletResponse response)
      throws IOException {
    ResponseWritingStage responseWritingStage =
        (ResponseWritingStage) request.getAttribute(responseWritingStageName);

    if (responseWritingStage == null) {
      responseWritingStage = processResponse(request, response, null);
    }

    response.flushBuffer();
    responseWritingStage.write();
  }

  private ResponseWritingStage processResponse(
      HttpServletRequest servletRequest, HttpServletResponse servletResponse, Object responseBody)
      throws IOException {
    ResponseProcessingStage responseProcessingStage =
        (ResponseProcessingStage) servletRequest.getAttribute(responseProcessingStageName);

    if (responseProcessingStage == null) {
      responseProcessingStage = processRequest(servletRequest, null, null);
    }

    return responseProcessingStage.process(
        new FilteredBodyServletHttpResponse(
            servletResponse, responseBody, servletRequest.getProtocol(), maskingResponseFilter));
  }

  private ResponseProcessingStage processRequest(
      HttpServletRequest request, Object requestBody, AnnotatedMethod annotatedMethod)
      throws IOException {
    return logbook
        .process(
            new FilteredBodyServletHttpRequest(
                request, requestBody, annotatedMethod, maskingRequestFilter))
        .write();
  }

  private AnnotatedMethod getParentAnnotatedMethod(MethodParameter methodParameter) {
    return Optional.ofNullable(methodParameter.getMethod()).map(AnnotatedMethod::new).orElse(null);
  }
}
