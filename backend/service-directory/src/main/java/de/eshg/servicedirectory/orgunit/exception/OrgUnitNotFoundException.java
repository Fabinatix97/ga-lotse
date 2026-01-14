/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.servicedirectory.orgunit.exception;

import java.io.Serial;
import java.util.UUID;

public class OrgUnitNotFoundException extends RuntimeException {

  @Serial private static final long serialVersionUID = 1L;
  private final UUID id;

  public OrgUnitNotFoundException(UUID id) {
    super("Could not find orgUnit with id " + id);
    this.id = id;
  }

  public UUID getId() {
    return id;
  }
}
