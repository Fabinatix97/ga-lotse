/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.filejockey.config;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.text.MessageFormat;

public class MessageFormatValidator implements ConstraintValidator<ValidMessageFormat, String> {

  private int maxArguments;

  @Override
  public void initialize(ValidMessageFormat constraintAnnotation) {
    this.maxArguments = constraintAnnotation.value();
  }

  @Override
  public boolean isValid(String input, ConstraintValidatorContext context) {
    if (input == null || input.isEmpty()) {
      return true;
    }
    try {
      MessageFormat messageFormat = new MessageFormat(input);
      int arguments = messageFormat.getFormatsByArgumentIndex().length;
      return arguments <= maxArguments;
    } catch (IllegalArgumentException _) {
      return false;
    }
  }
}
