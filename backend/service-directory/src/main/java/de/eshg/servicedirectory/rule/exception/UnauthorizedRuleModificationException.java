/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.servicedirectory.rule.exception;

import java.io.Serial;

public class UnauthorizedRuleModificationException extends RuntimeException {

  @Serial private static final long serialVersionUID = 1L;

  public UnauthorizedRuleModificationException(String message) {
    super(message);
  }
}
