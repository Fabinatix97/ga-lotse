/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.mapper;

import de.eshg.measlesprotection.api.draft.AffectedPersonDetailsDto;
import de.eshg.measlesprotection.api.draft.CreatePersonResponse;
import de.eshg.measlesprotection.persistence.db.MeaslesProtectionProcedure;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public class CreatePersonResponseMapper {

  private CreatePersonResponseMapper() {}

  public static CreatePersonResponse toInterfaceType(
      MeaslesProtectionProcedure procedure,
      @Valid @NotNull AffectedPersonDetailsDto affectedPerson) {
    return new CreatePersonResponse(procedure.getExternalId(), affectedPerson);
  }
}
