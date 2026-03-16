/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing.util;

import de.eshg.infectionbriefing.domain.model.InfectionBriefingProcedure;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.lib.procedure.domain.model.SystemProgressEntry;
import de.eshg.rest.service.error.BadRequestException;
import java.util.Arrays;
import java.util.List;

public class ProcedureValidator<T extends InfectionBriefingProcedure> {
  private final T procedure;
  private List<String> progressEntryTypes;

  private List<String> getProgressEntryTypes() {
    if (progressEntryTypes == null) {
      progressEntryTypes =
          procedure.getProgressEntries().stream()
              .filter(SystemProgressEntry.class::isInstance)
              .map(SystemProgressEntry.class::cast)
              .map(SystemProgressEntry::getSystemProgressEntryType)
              .toList();
    }
    return progressEntryTypes;
  }

  public ProcedureValidator(T procedure) {
    this.procedure = procedure;
  }

  public ProcedureValidator<T> validateStatusNull() {
    if (procedure.getProcedureStatus() != null) {
      throw new BadRequestException("Procedure does not have status null");
    }
    return this;
  }

  public ProcedureValidator<T> validateStatus(ProcedureStatus... expectedStatus) {
    if (!Arrays.asList(expectedStatus).contains(procedure.getProcedureStatus())) {
      throw new BadRequestException(
          "Procedure does not have status %s"
              .formatted(Arrays.toString(expectedStatus).replace("[", "").replace("]", "")));
    }
    return this;
  }

  public ProcedureValidator<T> validateHasSystemProgressEntryType(
      InfectionBriefingProgressEntryType expectedType) {
    if (!getProgressEntryTypes().contains(expectedType.name())) {
      throw new BadRequestException("No SystemProgressEntry of type %s".formatted(expectedType));
    }
    return this;
  }

  public ProcedureValidator<T> validateNoSystemProgressEntryWithType(
      InfectionBriefingProgressEntryType expectedType) {
    if (getProgressEntryTypes().contains(expectedType.name())) {
      throw new BadRequestException(
          "Procedure has a SystemProgressEntry of type %s".formatted(expectedType));
    }
    return this;
  }

  public T get() {
    return procedure;
  }
}
