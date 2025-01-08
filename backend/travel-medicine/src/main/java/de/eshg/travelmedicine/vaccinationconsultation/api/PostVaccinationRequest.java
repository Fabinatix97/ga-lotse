/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccinationconsultation.api;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record PostVaccinationRequest(
    @NotNull UUID diseaseId,
    @NotNull UUID vaccineId,
    VaccinationTypeDto vaccinationType,
    @NotNull @Min(1) int vaccinationNumber,
    @NotNull boolean createSeries) {}
