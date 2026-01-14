/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccine.api;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

/** Used for PUT and POST */
public record PostPutVaccineRequest(
    @NotBlank @Size(max = 200) String name,
    @NotNull UUID diseaseId,

    // the number of vaccinations is derived from the size of the offsets list
    @NotNull List<Integer> offsets,
    @Digits(integer = 6, fraction = 2) @NotNull @PositiveOrZero BigDecimal fee,
    @NotNull UUID inventoryVaccineId,
    String currentBatchId) {}
