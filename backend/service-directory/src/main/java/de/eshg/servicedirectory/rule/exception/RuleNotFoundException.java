/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.servicedirectory.rule.exception;

import java.io.Serial;
import java.util.UUID;

public class RuleNotFoundException extends RuntimeException {

  @Serial private static final long serialVersionUID = 1L;
  private final UUID id;

  public RuleNotFoundException(UUID id) {
    super("Could not find rule with id " + id);
    this.id = id;
  }

  public UUID getId() {
    return id;
  }
}
