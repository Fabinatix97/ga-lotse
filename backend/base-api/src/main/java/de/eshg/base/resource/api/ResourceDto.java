/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.resource.api;

import de.eshg.base.label.api.LabelDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.List;
import java.util.UUID;

@Schema(name = "Resource")
public record ResourceDto(
    @Schema(
            description = "The Id of the Resource.",
            example = "ae9831d4-dc25-48d8-9bfe-4c0b54bfb2c1")
        @NotNull
        UUID id,
    @Schema(description = "The name of the Resource.", example = "White delivery truck") @NotBlank
        String name,
    @Schema(
            description = "Free text field for descriptive information on the Resource.",
            example = "The car is parked in the right garage.")
        String description,
    @Schema(
            description = "A descriptive number of the Resource, e.g. the article or model number.",
            example = "T-800")
        String articleNumber,
    @NotNull ResourceTypeDto type,
    @NotNull @Valid List<LabelDto> labels)
    implements Serializable {}
