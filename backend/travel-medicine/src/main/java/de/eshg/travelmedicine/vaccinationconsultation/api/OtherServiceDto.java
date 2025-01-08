/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccinationconsultation.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Schema(name = "OtherService")
public record OtherServiceDto(
    @NotNull UUID id,
    @Size(max = 200) String description,
    @NotNull @PositiveOrZero BigDecimal fee,
    LocalDate appliedAt,
    @NotNull Instant createdAt,
    @NotNull Instant modifiedAt) {}
