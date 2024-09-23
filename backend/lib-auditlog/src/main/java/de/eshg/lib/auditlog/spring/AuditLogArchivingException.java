/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.auditlog.spring;

import java.io.Serial;

public class AuditLogArchivingException extends RuntimeException {

  @Serial private static final long serialVersionUID = 0;

  public AuditLogArchivingException(String message) {
    super(message);
  }
}
