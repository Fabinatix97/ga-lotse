/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api;

import de.eshg.base.GenderDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.time.Year;
import java.util.UUID;

@Schema(name = "Person")
public record PersonDto(
    @Schema(
            description = "An unique identifier for the person.",
            example = "25db7719-4924-4208-bb13-d0274e27279d")
        @NotNull
        UUID id,
    @NotNull GenderDto gender,
    @Schema(description = "The year of birth of the person.", example = "2000") @NotNull
        Year yearOfBirth,
    @Schema(description = "The prefered pronouns for the person.", example = "xier / dier")
        String pronouns,
    @Schema(
            description = "Flag for if the person has sufficient German language skills.",
            example = "null",
            type = "Boolean")
        Boolean hasSufficientGermanLanguageSkills,
    @Schema(
            description = "Other languages besides German that the person can speak.",
            example = "Russisch und Spanisch")
        String otherKnownLanguages,
    @Schema(
            description =
                "Unique code for patient identification and login to the online portal, valid until the procedure is closed.",
            example = "937ZiFaqjkfQgTBmo")
        String accessCode) {}
