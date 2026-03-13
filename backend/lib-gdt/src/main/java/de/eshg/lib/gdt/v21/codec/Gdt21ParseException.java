/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.gdt.v21.codec;

import java.io.Serial;

/** Thrown when a GDT 2.10 stream cannot be parsed. */
public class Gdt21ParseException extends RuntimeException {

  @Serial private static final long serialVersionUID = 1L;

  public Gdt21ParseException(String message) {
    super(message);
  }

  public Gdt21ParseException(String message, Throwable cause) {
    super(message, cause);
  }
}
