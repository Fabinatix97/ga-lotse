/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.medicalhistory;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import java.time.LocalDate;

@Schema(name = "RiskActivity")
public record RiskActivityDto(
    @NotNull RiskActivityTypeDto riskActivityType,
    @NotNull @PastOrPresent LocalDate riskActivityDate) {}
