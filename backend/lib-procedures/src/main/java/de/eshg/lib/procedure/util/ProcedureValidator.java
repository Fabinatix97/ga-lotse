/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.util;

import de.eshg.lib.procedure.domain.model.Procedure;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.rest.service.error.BadRequestException;

public class ProcedureValidator {
  private ProcedureValidator() {}

  public static void validateProcedureStatusNotClosed(Procedure<?, ?, ?, ?> procedure) {
    if (ProcedureStatus.isClosed(procedure.getProcedureStatus())) {
      throw new BadRequestException(
          "Procedure %s is closed and cannot be updated.".formatted(procedure.getExternalId()));
    }
  }
}
