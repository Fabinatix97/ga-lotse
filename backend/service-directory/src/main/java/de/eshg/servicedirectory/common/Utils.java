/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.servicedirectory.common;

import java.util.regex.Pattern;
import org.springframework.util.Assert;

public class Utils {

  public static final Pattern SNAKE_PATTERN = Pattern.compile("_([a-z])");

  public static final Pattern SQL_IDENTIFIER_PATTERN = Pattern.compile("[_a-zA-Z][_a-zA-Z0-9]*");

  public static String snakeToCamelCase(String str) {
    return SNAKE_PATTERN.matcher(str).replaceAll(m -> m.group(1).toUpperCase());
  }

  public static String snakeToKebabCase(String str) {
    return str.replace('_', '-');
  }

  public static String assertSqlIdentifier(String str) {
    Assert.isTrue(SQL_IDENTIFIER_PATTERN.matcher(str).matches(), "Invalid SQL identifier: " + str);
    return str;
  }
}
