/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.servicedirectory.actor.exception;

import java.io.Serial;

public class ActorNotActiveException extends RuntimeException {

  @Serial private static final long serialVersionUID = 1L;

  public ActorNotActiveException(String commonName) {
    super("The actor with the common name '" + commonName + "' was not active but has to be");
  }
}
