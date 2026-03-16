/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.gdt.v35.codec;

import java.io.Serial;

public class Gdt35ParseException extends RuntimeException {

  @Serial private static final long serialVersionUID = 1L;

  public Gdt35ParseException(String message) {
    super(message);
  }

  public Gdt35ParseException(String message, Throwable cause) {
    super(message, cause);
  }
}
