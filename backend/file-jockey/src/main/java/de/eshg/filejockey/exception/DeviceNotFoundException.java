/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.filejockey.exception;

import java.io.Serial;

public class DeviceNotFoundException extends RuntimeException {

  @Serial private static final long serialVersionUID = 1L;

  public DeviceNotFoundException(String message) {
    super(message);
  }
}
