/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.api;

import de.cronn.commons.lang.SetUtils;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.Set;
import java.util.UUID;

public record DeleteFileStatesRequest(
    @ArraySchema(
            arraySchema =
                @Schema(description = "A list of Ids of File States that shall be deleted."))
        @NotNull
        @Size(min = 1)
        Set<@NotNull UUID> fileStateIds) {
  public DeleteFileStatesRequest(UUID... fileStateIds) {
    this(SetUtils.orderedSet(fileStateIds));
  }
}
