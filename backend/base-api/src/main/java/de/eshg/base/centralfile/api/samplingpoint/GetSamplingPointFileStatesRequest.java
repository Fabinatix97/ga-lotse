/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.api.samplingpoint;

import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.Set;
import java.util.UUID;

public record GetSamplingPointFileStatesRequest(
    @ArraySchema(
            arraySchema =
                @Schema(description = "A list of Ids for requested SamplingPoint File States."))
        @NotNull
        @Size(min = 1)
        Set<UUID> fileStateIds,
    Boolean checkOutdated) {
  public GetSamplingPointFileStatesRequest(Set<UUID> fileStateIds) {
    this(fileStateIds, false);
  }
}
