/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.api.person;

import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

public record AddPersonFileStatesResponse(
    @ArraySchema(
            arraySchema =
                @Schema(description = "A list containing the file state IDs of the added persons"))
        @NotNull
        List<UUID> personFileStateIds) {}
