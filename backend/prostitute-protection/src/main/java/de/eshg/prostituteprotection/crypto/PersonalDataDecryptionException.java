/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.crypto;

import java.io.Serial;

public class PersonalDataDecryptionException extends RuntimeException {

  @Serial private static final long serialVersionUID = 1L;

  public PersonalDataDecryptionException(String message, Throwable cause) {
    super(message, cause);
  }
}
