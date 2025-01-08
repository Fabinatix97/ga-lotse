/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.api.person;

import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import java.util.UUID;

public record GetPersonFileStatesRequest(
    @ArraySchema(
            arraySchema = @Schema(description = "A list of Ids for requested Person File States."))
        @NotNull
        @Size(min = 1)
        List<UUID> fileStateIds,
    Boolean checkOutdated,
    @Valid GetPersonFileStatesSortParameters sortParameters) {

  public GetPersonFileStatesRequest(List<UUID> fileStateIds) {
    this(fileStateIds, false, null);
  }

  public GetPersonFileStatesRequest(List<UUID> fileStateIds, Boolean checkOutdated) {
    this(fileStateIds, checkOutdated, null);
  }

  public GetPersonFileStatesRequest(
      List<UUID> fileStateIds, GetPersonFileStatesSortParameters sortParameters) {
    this(fileStateIds, false, sortParameters);
  }
}
