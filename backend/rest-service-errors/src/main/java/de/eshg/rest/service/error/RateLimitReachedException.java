/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.rest.service.error;

import java.io.Serial;

public class RateLimitReachedException extends RuntimeException {

  @Serial private static final long serialVersionUID = 1L;

  public RateLimitReachedException(String message) {
    super(message);
  }
}
