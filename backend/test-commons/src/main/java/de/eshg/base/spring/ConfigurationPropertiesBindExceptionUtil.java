/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.spring;

import org.springframework.boot.context.properties.ConfigurationPropertiesBindException;
import org.springframework.boot.context.properties.bind.validation.BindValidationException;
import org.springframework.boot.context.properties.bind.validation.ValidationErrors;

public class ConfigurationPropertiesBindExceptionUtil {

  private ConfigurationPropertiesBindExceptionUtil() {}

  public static String getRootCauseSortedMessage(ConfigurationPropertiesBindException exception) {
    BindValidationException validationException =
        (BindValidationException) exception.getMostSpecificCause();
    return getSortedMessage(validationException);
  }

  public static String getSortedMessage(BindValidationException validationException) {
    ValidationErrors errors = validationException.getValidationErrors();
    StringBuilder message = new StringBuilder("Binding validation errors");
    if (errors != null) {
      message.append(" on ").append(errors.getName());
      errors.getAllErrors().stream()
          .map((error) -> String.format("%n   - %s", error))
          .sorted()
          .forEach(message::append);
    }
    return message.toString();
  }
}
