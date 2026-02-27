/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(name = "ConsultationParagraph7")
public record ConsultationParagraph7Dto(
    @NotNull boolean legalAdvices,
    @NotNull boolean healthAndSocialInsurance,
    @NotNull boolean consultingServices,
    @NotNull boolean emergencyHelp,
    @NotNull boolean taxLiability,
    @NotNull boolean informationMaterial,
    @NotNull boolean predicament) {}
