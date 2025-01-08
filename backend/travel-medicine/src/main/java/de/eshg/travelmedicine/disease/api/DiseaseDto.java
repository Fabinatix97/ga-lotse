/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.disease.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Schema(name = "Disease")
public record DiseaseDto(
    @NotNull UUID id,
    @NotBlank @Size(max = 200) String name,
    @Digits(integer = 6, fraction = 2) @PositiveOrZero BigDecimal estimatedFee,
    @NotNull boolean visibleToCitizenPortal,
    @NotNull Instant createdAt,
    Instant modifiedAt) {}
