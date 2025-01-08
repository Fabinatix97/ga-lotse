/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.testhelper.api;

import de.eshg.travelmedicine.vaccinationconsultation.api.PostOtherServiceRequest;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Schema(
    name = "OtherServicePopulation",
    description = "request the creation of an \"other service\" and assign a user defined key")
public record OtherServicePopulationDto(
    @NotBlank String serviceKey, @NotNull @Valid PostOtherServiceRequest request) {}
