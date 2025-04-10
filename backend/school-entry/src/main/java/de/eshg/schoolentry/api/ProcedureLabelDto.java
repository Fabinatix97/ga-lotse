/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.util.UUID;

@Schema(
    name = "SchoolEntryProcedureLabel",
    description =
        "Labels can be associated to a procedure. There are predefined labels and additional labels can be created by the users.")
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
        String hexColor,
    @Schema(description = "Indicates if label can be modified by users") @NotNull
        boolean readonly) {}
