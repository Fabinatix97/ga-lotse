/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api;

import de.eshg.base.GenderDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.time.Year;

public record UpdatePersonDetailsRequest(
    @NotNull GenderDto gender,
    @Schema(description = "Indicates the year of birth of the person.", example = "1996") @NotNull
        Year yearOfBirth,
    @Schema(description = "Indicates whether the patient has sufficient German language skills.")
        Boolean hasSufficientGermanLanguageSkills,
    @Schema(
            description = "Other languages the patient can speak or understand.",
            example = "Spanish and French.")
        String otherKnownLanguages,
    @Schema(description = "Specifies the pronouns the person uses.", example = "she/her")
        String pronouns) {}
