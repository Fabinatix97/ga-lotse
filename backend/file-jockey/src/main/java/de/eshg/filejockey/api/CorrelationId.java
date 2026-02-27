/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.filejockey.api;

import java.util.regex.Pattern;

public record CorrelationId(String value) {

  public static final Pattern PATTERN = Pattern.compile("^[A-Za-z0-9]{6}$");
  public static final String EMPTY_MESSAGE = "Correlation ID must not be empty";
  public static final String VALIDATION_MESSAGE =
      "Correlation ID must be exactly 6 alphanumeric characters (A-Z, a-z, 0-9)";

  public static CorrelationId of(String value) {
    return new CorrelationId(value);
  }
}
