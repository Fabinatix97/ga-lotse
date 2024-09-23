/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.commons.logging;

import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.http.server.ServletServerHttpResponse;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

/**
 * This controller advice handles responses passes them to logging. This happens at the last point
 * in time when the body is available as deserialized java object, which we need since we respect
 * the {@link de.eshg.api.commons.CanBeLogged} annotation for masking.
 */
@ControllerAdvice
public class LoggingResponseBodyAdvice implements ResponseBodyAdvice<Object> {

  private final FilteringLogbookAdapter eshgLogbookAdapter;

  public LoggingResponseBodyAdvice(FilteringLogbookAdapter eshgLogbookAdapter) {
    this.eshgLogbookAdapter = eshgLogbookAdapter;
  }

  @Override
  public boolean supports(
      MethodParameter returnType, Class<? extends HttpMessageConverter<?>> converterType) {
    return true;
  }

  @Override
  public Object beforeBodyWrite(
      Object body,
      MethodParameter returnType,
      MediaType selectedContentType,
      Class<? extends HttpMessageConverter<?>> selectedConverterType,
      ServerHttpRequest request,
      ServerHttpResponse response) {
    if (!(request instanceof ServletServerHttpRequest servletServerHttpRequest)
        || !(response instanceof ServletServerHttpResponse servletServerHttpResponse)) {
      return body;
    }

    eshgLogbookAdapter.handleResponse(
        servletServerHttpRequest.getServletRequest(),
        servletServerHttpResponse.getServletResponse(),
        body);
    return body;
  }
}
