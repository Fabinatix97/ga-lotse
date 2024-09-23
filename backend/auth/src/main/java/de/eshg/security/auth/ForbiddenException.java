/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.security.auth;

import java.io.Serial;

public class ForbiddenException extends RuntimeException {
  @Serial private static final long serialVersionUID = 1L;

  public ForbiddenException(String message) {
    super(message);
  }
}
