/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccinationconsultation.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Schema(
    name = "StepWithAppliedServices",
    description = "A list of the step's services which have been applied (to the resp. customer)")
public record StepWithAppliedServicesDto(
    @NotNull UUID procedureStepId,
    @NotNull Instant appointmentDateTime,
    @NotNull @Valid List<@NotNull AppliedServiceDto> appliedServices) {}
