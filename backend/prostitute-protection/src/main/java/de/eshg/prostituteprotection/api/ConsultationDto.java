/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.prostituteprotection.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(name = "Consultation")
public record ConsultationDto(
    @NotNull
        @Schema(
            description =
                "Version of the entity. Each time the entity is changed, it is incremented by one.")
        long version,
    @NotNull boolean legalAdvices,
    @NotNull boolean healthAndSocialInsurance,
    @NotNull boolean consultingServices,
    @NotNull boolean emergencyHelp,
    @NotNull boolean taxLiability,
    @NotNull boolean clearing,
    @NotNull boolean informationMaterial,
    @NotNull boolean predicament,
    @NotNull boolean diseasePrevention,
    @NotNull boolean birthControl,
    @NotNull boolean pregnancy,
    @NotNull boolean alcoholAndDrugUsage,
    @NotNull boolean referral) {}
