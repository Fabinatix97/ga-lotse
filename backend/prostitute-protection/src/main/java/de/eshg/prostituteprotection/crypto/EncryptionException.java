/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.crypto;

import java.io.Serial;

public class EncryptionException extends RuntimeException {

  @Serial private static final long serialVersionUID = 1L;

  public EncryptionException(String message, Throwable cause) {
    super(message, cause);
  }
}
