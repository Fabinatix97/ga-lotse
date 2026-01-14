/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.client;

import de.eshg.api.commons.InlineParameterObject;
import java.lang.reflect.Constructor;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.BeanWrapper;
import org.springframework.beans.BeanWrapperImpl;
import org.springframework.core.MethodParameter;
import org.springframework.core.convert.ConversionService;
import org.springframework.core.convert.TypeDescriptor;
import org.springframework.web.bind.support.BindParamNameResolver;
import org.springframework.web.service.invoker.HttpRequestValues.Builder;
import org.springframework.web.service.invoker.HttpServiceArgumentResolver;

public class SimpleModelAttributeArgumentResolver implements HttpServiceArgumentResolver {

  private final BindParamNameResolver bindParamNameResolver = new BindParamNameResolver();
  private final ConversionService conversionService;

  public SimpleModelAttributeArgumentResolver(ConversionService conversionService) {
    this.conversionService = conversionService;
  }

  @Override
  public boolean resolve(Object argument, MethodParameter parameter, Builder requestValues) {
    if (!parameter.hasParameterAnnotation(InlineParameterObject.class)) {
      return false;
    }

    if (BeanUtils.isSimpleProperty(parameter.getParameterType())) {
      return false;
    }

    if (argument == null) {
      return true;
    }

    Constructor<?> constructor;
    try {
      constructor = BeanUtils.getResolvableConstructor(parameter.getParameterType());
    } catch (IllegalStateException illegalStateException) {
      return false;
    }

    String[] parameterNames = BeanUtils.getParameterNames(constructor);
    BeanWrapper beanWrapper = new BeanWrapperImpl(argument);
    for (int parameterIndex = 0; parameterIndex < parameterNames.length; parameterIndex++) {
      String parameterName = parameterNames[parameterIndex];
      MethodParameter methodParameter =
          MethodParameter.forFieldAwareConstructor(constructor, parameterIndex, parameterName);

      Object propertyValue = beanWrapper.getPropertyValue(parameterName);
      if (propertyValue == null) {
        continue;
      }

      String boundParameterName = resolveBoundRequestParameter(methodParameter);
      requestValues.addRequestParameter(
          boundParameterName, convertToString(propertyValue, methodParameter));
    }

    return true;
  }

  private String convertToString(Object propertyValue, MethodParameter methodParameter) {
    return (String)
        conversionService.convert(
            propertyValue,
            new TypeDescriptor(methodParameter),
            TypeDescriptor.valueOf(String.class));
  }

  private String resolveBoundRequestParameter(MethodParameter methodParameter) {
    String resolvedName = bindParamNameResolver.resolveName(methodParameter);
    if (resolvedName != null) {
      return resolvedName;
    }
    String parameterName = methodParameter.getParameterName();

    if (parameterName == null) {
      throw new IllegalStateException("Could not resolve parameter name of %s" + methodParameter);
    }

    return parameterName;
  }
}
