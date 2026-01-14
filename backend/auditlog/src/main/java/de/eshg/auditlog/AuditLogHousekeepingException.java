/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.auditlog;

import java.io.Serial;

public class AuditLogHousekeepingException extends RuntimeException {
  @Serial private static final long serialVersionUID = 1L;

  public AuditLogHousekeepingException(String message, Exception e) {
    super(message, e);
  }
}
