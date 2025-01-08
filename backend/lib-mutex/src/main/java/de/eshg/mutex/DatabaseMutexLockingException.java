/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.mutex;

import java.io.Serial;

public class DatabaseMutexLockingException extends RuntimeException {

  @Serial private static final long serialVersionUID = 1L;

  public DatabaseMutexLockingException(String message, Exception cause) {
    super(message, cause);
  }
}
