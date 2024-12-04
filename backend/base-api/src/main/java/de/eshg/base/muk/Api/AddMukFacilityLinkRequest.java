/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.muk.Api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

@Schema(
    description =
        "Request used for establishing a link between a MUK user and a reference facility")
public record AddMukFacilityLinkRequest(
    @Schema(
            description = "The id of the mukUser",
            example = "du-986b2b54ab89cf4ed674ad8c3126b966b54d4872")
        @NotBlank
        String mukId,
    @Schema(
            description = "The (external) id of the reference facility",
            example = "be9831d4-dc25-48d8-9bfe-4c0b54bfb2c1")
        @NotNull
        UUID referenceFacilityId) {}
