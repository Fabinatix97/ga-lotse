/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.UUID;

@Schema(name = "AccessRestrictionLetter")
public record AccessRestrictionLetterDto(
    @NotNull
        @Schema(
            description = "The unique identifier for the access restriction letter.",
            example = "0e47cc46-0092-40df-883b-581e31288e28")
        UUID externalId,
    @NotNull
        @Schema(
            description = "The unique identifier for the recipient of the restriction letter.",
            example = "1d423cc46-0092-40df-883b-581e31288e28")
        UUID recipientId,
    @NotNull
        @Schema(
            description = "The date and time when the access restriction letter was sent.",
            example = "2024-06-03")
        LocalDate sentAt,
    @Schema(
            description = "The id of the document related to the access restriction letter.",
            example = "2f415cc46-s987-40df-883b-581e31288e28")
        UUID documentFileId) {}
