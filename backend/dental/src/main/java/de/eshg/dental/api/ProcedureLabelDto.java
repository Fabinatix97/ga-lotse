/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.dental.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.util.UUID;

@Schema(name = "DentalProcedureLabel", description = "Labels can be associated to a procedure.")
public record ProcedureLabelDto(
    @NotNull @Schema(description = "Id of the label") UUID id,
    @NotNull
        @Schema(
            description =
                "Version of the entity. Each time the entity is changed, it is incremented by one.")
        long version,
    @Schema(description = "Name of the label") @NotEmpty @Size(max = 255) String name,
    @Schema(description = "Description of the label") String description,
    @Schema(description = "Background color of the box surrounding the label")
        @NotEmpty
        @Pattern(regexp = "^#[0-9a-zA-Z]{6}$")
        String hexColor) {}
