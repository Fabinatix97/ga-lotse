/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.servicedirectory.actor.exception;

import java.io.Serial;
import java.util.UUID;

public class ActorNotFoundException extends RuntimeException {

  @Serial private static final long serialVersionUID = 1L;
  private final UUID id;

  public ActorNotFoundException(UUID id) {
    super("Could not find actor with id " + id);
    this.id = id;
  }

  public ActorNotFoundException(String cn) {
    super("Could not find actor with common name " + cn);
    this.id = null;
  }

  public UUID getId() {
    return id;
  }
}
