/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.centralrepository.exception;

import java.io.Serial;

public class CentralRepositoryIOException extends RuntimeException {

  @Serial private static final long serialVersionUID = 1L;

  public CentralRepositoryIOException() {
    super("There has been an error while trying to access the repository.");
  }
}
