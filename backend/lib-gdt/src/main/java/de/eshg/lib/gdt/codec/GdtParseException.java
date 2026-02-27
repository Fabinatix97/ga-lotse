/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.gdt.codec;

import java.io.Serial;

public class GdtParseException extends RuntimeException {

  @Serial private static final long serialVersionUID = 1L;

  public GdtParseException(String message) {
    super(message);
  }

  public GdtParseException(String message, Throwable cause) {
    super(message, cause);
  }
}
