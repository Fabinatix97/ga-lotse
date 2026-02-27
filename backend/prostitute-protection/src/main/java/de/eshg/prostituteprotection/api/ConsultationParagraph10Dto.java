/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.prostituteprotection.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(name = "ConsultationParagraph10")
public record ConsultationParagraph10Dto(
    @NotNull boolean diseasePrevention,
    @NotNull boolean birthControl,
    @NotNull boolean pregnancy,
    @NotNull boolean alcoholAndDrugUsage,
    @NotNull boolean referral,
    @NotNull boolean clearing) {}
