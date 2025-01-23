/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.util;

import de.cronn.reflection.util.PropertyUtils;
import de.eshg.lib.procedure.api.ProcedureSearchParameters;
import de.eshg.lib.procedure.domain.model.Procedure;
import de.eshg.lib.procedure.domain.model.ProcedureStatus;
import de.eshg.rest.service.error.BadRequestException;
import java.util.Objects;

public class ProcedureValidator {
  private ProcedureValidator() {}

  public static void validateProcedureStatusNotClosed(Procedure<?, ?, ?, ?> procedure) {
    if (ProcedureStatus.isClosed(procedure.getProcedureStatus())) {
      throw new BadRequestException(
          "Procedure %s is closed and cannot be updated.".formatted(procedure.getExternalId()));
    }
  }

  public static void validateSearchParametersAreComplete(
      ProcedureSearchParameters searchParameters) {
    if (hasNonNullValue(searchParameters)
        && (searchParameters.searchFirstName() == null
            || searchParameters.searchLastName() == null
            || searchParameters.searchDateOfBirth() == null)) {
      throw new BadRequestException(
          "If search parameters are used, all of firstName, lastName and dateOfBirth have to be provided.");
    }
  }

  public static boolean hasNonNullValue(Record object) {
    return PropertyUtils.getPropertyDescriptors(object).stream()
        .filter(descriptor -> !PropertyUtils.isDeclaredInClass(descriptor, Object.class))
        .filter(PropertyUtils::isReadable)
        .map(prop -> PropertyUtils.read(object, prop))
        .anyMatch(Objects::nonNull);
  }
}
