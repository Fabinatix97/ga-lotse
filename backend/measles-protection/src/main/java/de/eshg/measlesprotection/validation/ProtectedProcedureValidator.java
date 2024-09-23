/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.validation;

import de.eshg.measlesprotection.ProcedureFinder;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.util.UUID;

public class ProtectedProcedureValidator implements ConstraintValidator<ProtectedProcedure, UUID> {

  private final ProcedureFinder procedureFinder;

  public ProtectedProcedureValidator(ProcedureFinder procedureFinder) {
    this.procedureFinder = procedureFinder;
  }

  @Override
  public boolean isValid(UUID procedureId, ConstraintValidatorContext context) {
    if (procedureId == null) {
      return true;
    }
    return procedureFinder.isOpenProcedure(procedureId);
  }
}
