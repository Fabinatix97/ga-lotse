/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.filejockey.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.util.regex.Pattern;

public class CorrelationIdValidator implements ConstraintValidator<ValidCorrelationId, String> {

  public static final Pattern PATTERN = Pattern.compile("^[A-Za-z0-9]{6}$");
  public static final String EMPTY_ERROR_MESSAGE = "Correlation ID must not be empty";
  public static final String PATTERN_ERROR_MESSAGE =
      "Correlation ID must be exactly 6 alphanumeric characters (A-Z, a-z, 0-9)";

  @Override
  public boolean isValid(String value, ConstraintValidatorContext context) {
    if (value == null || value.isBlank()) {
      context.disableDefaultConstraintViolation();
      context.buildConstraintViolationWithTemplate(EMPTY_ERROR_MESSAGE).addConstraintViolation();
      return false;
    }
    if (!PATTERN.matcher(value).matches()) {
      context.disableDefaultConstraintViolation();
      context.buildConstraintViolationWithTemplate(PATTERN_ERROR_MESSAGE).addConstraintViolation();
      return false;
    }
    return true;
  }
}
