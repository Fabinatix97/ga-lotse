/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.medicalhistory;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.Set;

@Schema(name = "Prevention")
public record PreventionDto(
    @Schema(
            description = "Provides information on vaccinations the patient has received.",
            example = "['HEPATITIS_A', 'HPV']")
        Set<VaccinationDto> vaccinations,
    @Schema(description = "Indicates whether the patient engages in practices considered safe sex.")
        SafeSexPracticeDto safeSexPractice,
    @Schema(
            description =
                "Lists the methods of protection the patient has used during sexual activity.",
            example = "['CONDOM','PREP']")
        Set<ProtectionMethodDto> protectionMethodsUsed,
    @Schema(description = "Indicates whether the patient wishes to receive information about PrEP.")
        Boolean infoAboutPrepDesired) {}
