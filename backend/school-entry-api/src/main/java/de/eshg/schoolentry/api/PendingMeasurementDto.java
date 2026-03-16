/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.schoolentry.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

@Schema(name = "PendingMeasurement")
public record PendingMeasurementDto(
    @NotNull @Pattern(regexp = "^[A-Za-z0-9]{6}$") String correlationId,
    @NotBlank String equipmentSelector,
    @NotBlank String equipmentName,
    @NotBlank String firstNameAlias,
    @NotBlank String lastNameAlias) {}
