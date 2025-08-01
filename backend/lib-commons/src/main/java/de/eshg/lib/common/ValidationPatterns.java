/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.common;

public class ValidationPatterns {
  public static final String E_MAIL_PATTERN =
      "(?i)^(?=.{6,254})(?!\\.)(?!.*\\.\\.)([A-Z0-9_+-.]*)[A-Z0-9_+-]@([A-Z0-9]+(-+[A-Z0-9]+)*\\.)+[A-Z]{2,}$";

  private ValidationPatterns() {}
}
