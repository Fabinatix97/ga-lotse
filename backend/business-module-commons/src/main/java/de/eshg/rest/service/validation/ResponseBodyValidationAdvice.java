/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.validation;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import java.lang.reflect.Method;
import java.util.Comparator;
import java.util.List;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.MethodParameter;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

/**
 * This controller advice is designed to be automatically activated via auto-configuration, enabling
 * response validation for all REST controllers.
 *
 * <p>It seamlessly integrates with the application, requiring no manual activation via
 * {@code @Validated} on every REST controller class and {@code @Valid} on each and every REST
 * controller method. This advice ensures that every response from REST controllers is validated
 * against the defined constraints, promoting consistent and reliable output across the application.
 *
 * <p>Using a global advice simplifies the development process by eliminating the need for
 * repetitive validation annotations with a high risk of omitted annotations.
 *
 * <p>To enable this feature, simply include the {@code business-module-commons} module as
 * dependency, and the Spring Framework will automatically import and apply this advice via {@link
 * de.eshg.rest.service.ResponseValidationAutoConfiguration}.
 */
@RestControllerAdvice
public class ResponseBodyValidationAdvice implements ResponseBodyAdvice<Object> {

  private static final Logger log = LoggerFactory.getLogger(ResponseBodyValidationAdvice.class);

  private final Validator validator;

  public ResponseBodyValidationAdvice(Validator validator) {
    this.validator = validator;
  }

  @Override
  public boolean supports(
      @NotNull MethodParameter returnType,
      @NotNull Class<? extends HttpMessageConverter<?>> converterType) {
    return true;
  }

  @Override
  public Object beforeBodyWrite(
      Object body,
      @NotNull MethodParameter returnType,
      @NotNull MediaType selectedContentType,
      @NotNull Class<? extends HttpMessageConverter<?>> selectedConverterType,
      @NotNull ServerHttpRequest request,
      @NotNull ServerHttpResponse response) {
    if (body == null) {
      return body;
    }

    List<ConstraintViolation<Object>> constraintViolations =
        validator.validate(body).stream()
            .sorted(
                Comparator.comparing(
                    constraintViolation -> constraintViolation.getPropertyPath().toString()))
            .toList();

    if (!constraintViolations.isEmpty()) {
      Method method = returnType.getMethod();
      if (method != null) {
        log.error(
            "The response of {}.{}() violates {} constraint{}:",
            method.getDeclaringClass().getSimpleName(),
            method.getName(),
            constraintViolations.size(),
            constraintViolations.size() == 1 ? "" : "s");
      }
      for (ConstraintViolation<?> constraintViolation : constraintViolations) {
        log.error(
            "❌ {}.{}: {}",
            body.getClass().getSimpleName(),
            constraintViolation.getPropertyPath(),
            constraintViolation.getMessage());
      }
      response.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return body;
  }
}
