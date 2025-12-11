/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.prostituteprotection.crypto;

import java.io.Serial;

public class PersonalDataDecryptionException extends RuntimeException {

  @Serial private static final long serialVersionUID = 1L;

  public PersonalDataDecryptionException(String message, Throwable cause) {
    super(message, cause);
  }
}
