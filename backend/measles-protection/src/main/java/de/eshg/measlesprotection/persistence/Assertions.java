/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.persistence;

import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.rest.service.error.BadRequestException;
import java.util.Objects;
import java.util.UUID;

public final class Assertions {

  private Assertions() {}

  public static void assertProcedureStatus(
      UUID id, ProcedureStatus expected, ProcedureStatus actual) {
    if (Objects.equals(expected, actual)) {
      return;
    }
    throw new BadRequestException(
        "%s: expected procedure in status '%s' but was %s".formatted(id, expected, actual));
  }
}
