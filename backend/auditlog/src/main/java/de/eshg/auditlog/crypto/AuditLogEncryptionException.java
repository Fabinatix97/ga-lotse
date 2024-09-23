/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.auditlog.crypto;

import java.io.Serial;

public class AuditLogEncryptionException extends RuntimeException {
  @Serial private static final long serialVersionUID = 1L;

  public AuditLogEncryptionException(String message, Throwable cause) {
    super(message, cause);
  }
}
