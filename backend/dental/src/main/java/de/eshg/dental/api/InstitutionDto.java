/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import java.util.UUID;

@Schema(name = "Institution")
public record InstitutionDto(
    @NotNull UUID id,
    @NotNull String name,
    @Schema(description = "Background color of the box surrounding the institution")
        @NotEmpty
        @Pattern(regexp = "^#[0-9a-zA-Z]{6}$")
        String hexColor) {}
