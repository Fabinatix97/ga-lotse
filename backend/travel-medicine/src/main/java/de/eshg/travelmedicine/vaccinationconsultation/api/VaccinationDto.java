/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccinationconsultation.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Schema(name = "Vaccination")
public record VaccinationDto(
    @NotNull UUID id,
    @NotNull @Size(max = 200) String diseaseName,
    @NotNull @Size(max = 200) String vaccineName,
    VaccinationTypeDto vaccinationType,
    @NotNull @Min(1) int vaccinationNumber,

    // fee: not yet available

    @Size(max = 200) String batchIdentifier,
    @Size(max = 200) String defaultBatchIdentifier,
    LocalDate appliedAt,
    @NotNull Instant createdAt,
    @NotNull Instant modifiedAt) {}
