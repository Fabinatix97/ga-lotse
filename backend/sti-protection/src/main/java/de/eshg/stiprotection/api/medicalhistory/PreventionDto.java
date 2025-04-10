/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.medicalhistory;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.Set;

@Schema(name = "Prevention")
public record PreventionDto(
    Set<VaccinationDto> vaccinations,
    SafeSexPracticeDto safeSexPractice,
    Set<ProtectionMethodDto> protectionMethodsUsed,
    @Schema(description = "Indicates whether the patient wishes to receive information about PrEP.")
        Boolean infoAboutPrepDesired) {}
