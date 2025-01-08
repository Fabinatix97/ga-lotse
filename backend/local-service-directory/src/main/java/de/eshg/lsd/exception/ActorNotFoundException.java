/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lsd.exception;

import java.io.Serial;

public class ActorNotFoundException extends RuntimeException {
  @Serial private static final long serialVersionUID = 1L;

  public ActorNotFoundException(String userName) {
    super("Could not find actor with username '" + userName + "'");
  }
}
