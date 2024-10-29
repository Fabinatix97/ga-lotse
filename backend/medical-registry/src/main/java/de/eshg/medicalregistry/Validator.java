/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medicalregistry;

import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.medicalregistry.domain.model.MedicalRegistryEntry;
import de.eshg.rest.service.error.BadRequestException;

public final class Validator {
  private Validator() {}

  public static void validateIsDraft(MedicalRegistryEntry procedure) {
    if (procedure.getProcedureStatus() != ProcedureStatus.DRAFT) {
      throw new BadRequestException(
          "Procedure %s is not in draft status and therefore cannot be deleted."
              .formatted(procedure.getExternalId()));
    }
  }
}
