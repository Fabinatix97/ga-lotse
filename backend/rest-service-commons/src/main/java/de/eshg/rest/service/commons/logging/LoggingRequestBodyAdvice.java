/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.commons.logging;

import jakarta.servlet.http.HttpServletRequest;
import java.lang.reflect.Type;
import org.springframework.core.MethodParameter;
import org.springframework.http.HttpInputMessage;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.RequestBodyAdviceAdapter;

/**
 * This controller advice handles request with a body and passes them to logging. This happens at
 * the first point in time when the body is available as deserialized java object, which we need
 * since we respect the {@link de.eshg.api.commons.CanBeLogged} annotation for masking.
 */
@ControllerAdvice
public class LoggingRequestBodyAdvice extends RequestBodyAdviceAdapter {

  private final HttpServletRequest request;
  private final FilteringLogbookAdapter eshgLogbookAdapter;

  public LoggingRequestBodyAdvice(
      HttpServletRequest request, FilteringLogbookAdapter eshgLogbookAdapter) {
    this.request = request;
    this.eshgLogbookAdapter = eshgLogbookAdapter;
  }

  @Override
  public boolean supports(
      MethodParameter methodParameter,
      Type targetType,
      Class<? extends HttpMessageConverter<?>> converterType) {
    return true;
  }

  @Override
  public Object afterBodyRead(
      Object body,
      HttpInputMessage inputMessage,
      MethodParameter parameter,
      Type targetType,
      Class<? extends HttpMessageConverter<?>> converterType) {
    eshgLogbookAdapter.handleRequest(request, body, parameter);
    return super.afterBodyRead(body, inputMessage, parameter, targetType, converterType);
  }

  @Override
  public Object handleEmptyBody(
      Object body,
      HttpInputMessage inputMessage,
      MethodParameter parameter,
      Type targetType,
      Class<? extends HttpMessageConverter<?>> converterType) {
    eshgLogbookAdapter.handleRequest(request, parameter);
    return super.handleEmptyBody(body, inputMessage, parameter, targetType, converterType);
  }
}
