/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.validation;

import de.eshg.rest.service.error.BadRequestException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.Map;
import java.util.Set;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

public class UnknownQueryParameterValidator implements HandlerInterceptor {

  private static final String DEFAULT_PACKAGE_NAME_PREFIX = "de.eshg";

  private final String packagePrefix;

  public UnknownQueryParameterValidator() {
    this(DEFAULT_PACKAGE_NAME_PREFIX);
  }

  UnknownQueryParameterValidator(String packagePrefix) {
    this.packagePrefix = packagePrefix;
  }

  @Override
  public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
      throws Exception {
    Map<String, String[]> requestParameters = request.getParameterMap();
    if (requestParameters.isEmpty()) {
      return HandlerInterceptor.super.preHandle(request, response, handler);
    }

    if (handler instanceof HandlerMethod handlerMethod) {
      if (shouldSkipController(handlerMethod.getBeanType())) {
        return HandlerInterceptor.super.preHandle(request, response, handler);
      }

      Set<String> supportedQueryParameterNames =
          RequestParameterUtil.getParameterNames(handlerMethod);
      for (String queryParameterName : requestParameters.keySet()) {
        if (!supportedQueryParameterNames.contains(queryParameterName)) {
          throw new BadRequestException(
              "Unsupported query parameter: '%s'".formatted(queryParameterName));
        }
      }
    }

    return HandlerInterceptor.super.preHandle(request, response, handler);
  }

  private boolean shouldSkipController(Class<?> controllerClass) {
    return !controllerClass.getPackageName().startsWith(packagePrefix);
  }
}
