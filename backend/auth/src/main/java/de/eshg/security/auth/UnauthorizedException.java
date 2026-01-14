/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.security.auth;

import java.io.Serial;

public class UnauthorizedException extends RuntimeException {
  @Serial private static final long serialVersionUID = 1L;

  public UnauthorizedException(String message, Throwable cause) {
    super(message, cause);
  }
}
