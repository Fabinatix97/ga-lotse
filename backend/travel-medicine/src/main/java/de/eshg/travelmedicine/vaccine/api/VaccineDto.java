/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccine.api;

import de.eshg.travelmedicine.disease.api.DiseaseDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * @param id
 * @param name user-readable name of the vaccine
 * @param disease ID of the disease this vaccine os used for, mandatory
 * @param numVaccinations number of shots needed for full immunization
 * @param offsets minimum time (in weeks) to wait between first and followup vaccination (size:
 *     numVaccinations - 1)
 */
@Schema(name = "Vaccine")
public record VaccineDto(
    @NotNull UUID id,
    @NotBlank @Size(max = 200) String name,
    @Valid @NotNull DiseaseDto disease,
    @NotNull @Positive int numVaccinations,
    @NotNull List<Integer> offsets,
    @Digits(integer = 6, fraction = 2) @PositiveOrZero BigDecimal fee,
    @NotNull UUID inventoryVaccineId,
    @NotNull Instant createdAt,
    @NotNull Instant modifiedAt,
    String currentBatchId) {}
