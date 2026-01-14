/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.auditlog.crypto;

import java.io.Serial;
import java.security.GeneralSecurityException;

public class AuditLogDecryptionException extends RuntimeException {
  @Serial private static final long serialVersionUID = 1L;

  public AuditLogDecryptionException(String message, GeneralSecurityException e) {
    super(message, e);
  }
}
