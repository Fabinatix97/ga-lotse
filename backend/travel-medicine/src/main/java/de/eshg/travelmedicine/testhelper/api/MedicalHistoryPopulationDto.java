/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.testhelper.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(
    name = "MedicalHistoryPopulation",
    description = "request the modification of the medical history of one of the steps/appointment")
public record MedicalHistoryPopulationDto(
    @NotBlank String stepKey, Boolean answered, String note) {}
