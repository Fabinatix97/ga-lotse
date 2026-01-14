/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.spatz.server;

import java.io.Serial;

public class SslContextException extends RuntimeException {
  @Serial private static final long serialVersionUID = 1L;

  public SslContextException(String message, Throwable cause) {
    super(message, cause);
  }
}
