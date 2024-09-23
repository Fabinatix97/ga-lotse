/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.commons.logging;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.Arrays;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

/**
 * This interceptor, intercepts request <i>without</i> a body and passes them to be logged.
 *
 * <p>When we expect a body (i.e. the controller method has a {@link RequestBody}) annotation, this
 * request will be handled by {@link LoggingRequestBodyAdvice} again, thus in this case it is not
 * passed to be logged.
 */
class WithoutBodyLoggingHandlerInterceptor implements HandlerInterceptor {

  private final FilteringLogbookAdapter eshgLogBookAdapter;

  WithoutBodyLoggingHandlerInterceptor(FilteringLogbookAdapter eshgLogBookAdapter) {
    this.eshgLogBookAdapter = eshgLogBookAdapter;
  }

  @Override
  public boolean preHandle(
      HttpServletRequest request, HttpServletResponse response, Object handler) {
    if (!(handler instanceof HandlerMethod handlerMethod) || shouldHaveRequestBody(handlerMethod)) {
      return true;
    }

    eshgLogBookAdapter.handleRequest(request, handlerMethod);
    return true;
  }

  private boolean shouldHaveRequestBody(HandlerMethod handlerMethod) {
    return Arrays.stream(handlerMethod.getMethodParameters())
        .anyMatch(methodParameter -> methodParameter.hasParameterAnnotation(RequestBody.class));
  }
}
