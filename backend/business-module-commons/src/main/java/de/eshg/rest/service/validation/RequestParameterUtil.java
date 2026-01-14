/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.validation;

import static java.util.function.Predicate.not;

import java.lang.annotation.Annotation;
import java.lang.reflect.Constructor;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.springframework.beans.BeanUtils;
import org.springframework.core.MethodParameter;
import org.springframework.core.annotation.AnnotatedMethod;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.support.BindParamNameResolver;

final class RequestParameterUtil {

  private static final BindParamNameResolver BIND_PARAM_NAME_RESOLVER = new BindParamNameResolver();
  private static final Set<Class<? extends Annotation>> REQUEST_PARAMETER_ANNOTATIONS =
      Set.of(RequestParam.class, PathVariable.class, RequestBody.class, RequestPart.class);

  private RequestParameterUtil() {}

  public static Set<String> getParameterNames(AnnotatedMethod handlerMethod) {
    return getMethodParameters(handlerMethod)
        .map(RequestParameterUtil::resolveRequestParameterName)
        .collect(Collectors.toSet());
  }

  private static Stream<MethodParameter> getMethodParameters(AnnotatedMethod handlerMethod) {
    return Stream.concat(
        getNonNestedParameters(handlerMethod), getNestedMethodParameters(handlerMethod));
  }

  private static Stream<MethodParameter> getNestedMethodParameters(AnnotatedMethod method) {
    return Arrays.stream(method.getMethodParameters())
        .filter(parameter -> !BeanUtils.isSimpleProperty(parameter.getParameterType()))
        .filter(RequestParameterUtil::isNotAnnotatedWithSpringRequestAnnotations)
        .map(MethodParameter::getParameterType)
        .map(BeanUtils::getResolvableConstructor)
        .map(RequestParameterUtil::getMethodParameters)
        .flatMap(Collection::stream);
  }

  private static List<MethodParameter> getMethodParameters(Constructor<?> constructor) {
    List<MethodParameter> methodParameters = new ArrayList<>();
    String[] parameterNames = BeanUtils.getParameterNames(constructor);
    for (int i = 0; i < parameterNames.length; i++) {
      methodParameters.add(
          MethodParameter.forFieldAwareConstructor(constructor, i, parameterNames[i]));
    }

    return methodParameters;
  }

  private static boolean isNotAnnotatedWithSpringRequestAnnotations(MethodParameter parameter) {
    Annotation[] annotations = parameter.getParameterAnnotations();

    return Arrays.stream(annotations)
        .map(Annotation::annotationType)
        .noneMatch(REQUEST_PARAMETER_ANNOTATIONS::contains);
  }

  private static Stream<MethodParameter> getNonNestedParameters(AnnotatedMethod handlerMethod) {
    return Arrays.stream(handlerMethod.getMethodParameters())
        .filter(RequestParameterUtil::isNonNestedParameter);
  }

  private static boolean isNonNestedParameter(MethodParameter methodParameter) {
    return methodParameter.hasParameterAnnotation(RequestParam.class)
        || methodParameter.hasParameterAnnotation(RequestPart.class);
  }

  private static String resolveRequestParameterName(MethodParameter methodParameter) {
    if (methodParameter.hasParameterAnnotation(RequestParam.class)) {
      return resolveRequestParamAnnotatedName(methodParameter);
    }

    if (methodParameter.hasParameterAnnotation(RequestPart.class)) {
      return resolveRequestPartAnnotatedName(methodParameter);
    }

    return resolveBoundName(methodParameter);
  }

  private static String resolveRequestParamAnnotatedName(MethodParameter methodParameter) {
    return Optional.ofNullable(methodParameter.getParameterAnnotation(RequestParam.class))
        .map(RequestParam::name)
        .filter(not(String::isBlank))
        .orElse(methodParameter.getParameter().getName());
  }

  private static String resolveRequestPartAnnotatedName(MethodParameter methodParameter) {
    return Optional.ofNullable(methodParameter.getParameterAnnotation(RequestPart.class))
        .map(RequestPart::name)
        .filter(not(String::isBlank))
        .orElse(methodParameter.getParameter().getName());
  }

  private static String resolveBoundName(MethodParameter parameter) {
    String boundName = BIND_PARAM_NAME_RESOLVER.resolveName(parameter);
    if (boundName == null) {
      return parameter.getParameterName();
    }
    return boundName;
  }
}
