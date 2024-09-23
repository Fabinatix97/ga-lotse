/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.otherservicetemplate.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Schema(name = "OtherServiceTemplate")
public record OtherServiceTemplateDto(
    @NotNull UUID id,
    @NotNull String description,
    @NotNull @Digits(integer = 6, fraction = 2) @PositiveOrZero BigDecimal fee,
    @NotNull Instant createdAt,
    @NotNull Instant modifiedAt) {}
