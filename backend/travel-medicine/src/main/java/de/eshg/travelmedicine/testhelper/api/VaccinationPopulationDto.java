/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.testhelper.api;

import de.eshg.travelmedicine.vaccinationconsultation.api.PostVaccinationRequest;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Schema(
    name = "VaccinationPopulation",
    description = "request the creation of a vaccination service and assign a user defined key")
public record VaccinationPopulationDto(
    @NotBlank String serviceKey, @NotNull @Valid PostVaccinationRequest request) {}
