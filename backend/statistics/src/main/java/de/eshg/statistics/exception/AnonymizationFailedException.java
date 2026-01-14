/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.statistics.exception;

import java.io.Serial;

public class AnonymizationFailedException extends RuntimeException {
  @Serial private static final long serialVersionUID = 1L;

  public AnonymizationFailedException(String message) {
    super(message);
  }

  public AnonymizationFailedException(Throwable cause) {
    super(cause);
  }
}
