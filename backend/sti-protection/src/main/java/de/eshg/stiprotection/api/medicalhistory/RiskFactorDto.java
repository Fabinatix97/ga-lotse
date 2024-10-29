/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.medicalhistory;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import java.time.LocalDate;
import java.util.Set;

@Schema(name = "RiskFactors")
public record RiskFactorDto(
    @Valid VaccinationDto vaccinations,
    SafeSexPracticeDto safeSexPractice,
    Set<ProtectionMethodDto> protectionMethodsUsed,
    @NotNull Boolean prepInfoProvided,
    @PastOrPresent LocalDate riskActivityDateVaginalIntercourse,
    @PastOrPresent LocalDate riskActivityDateOralIntercourse,
    @PastOrPresent LocalDate riskActivityDateAnalIntercourse,
    String otherRiskActivities) {}
