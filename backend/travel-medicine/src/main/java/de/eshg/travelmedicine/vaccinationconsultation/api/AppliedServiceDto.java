/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccinationconsultation.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

@Schema(
    name = "AppliedService",
    description = "One of the applied service in the StepWithAppliedServicesDto list")
public record AppliedServiceDto(@NotNull UUID serviceId, @NotNull String serviceDescription) {}
