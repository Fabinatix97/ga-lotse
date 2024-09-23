/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.commons.logging;

import de.eshg.api.commons.CanBeLogged;
import de.eshg.rest.service.commons.utils.RequestParameterUtil;
import java.util.Collections;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.core.MethodParameter;
import org.springframework.core.annotation.AnnotatedMethod;

public class RequestLoggingUtils {

  public static Set<String> getNamesOfParametersThatCanBeLogged(AnnotatedMethod handlerMethod) {
    if (handlerMethod == null) {
      return Collections.emptySet();
    }

    return RequestParameterUtil.getMethodParameters(handlerMethod)
        .filter(RequestLoggingUtils::canBeLogged)
        .map(RequestParameterUtil::resolveRequestParameterName)
        .collect(Collectors.toSet());
  }

  private static boolean canBeLogged(MethodParameter methodParameter) {
    boolean isUuidParameter = UUID.class.isAssignableFrom(methodParameter.getParameterType());
    boolean canBeLoggedAnnotationIsPresent =
        methodParameter.hasParameterAnnotation(CanBeLogged.class);

    return isUuidParameter || canBeLoggedAnnotationIsPresent;
  }
}
