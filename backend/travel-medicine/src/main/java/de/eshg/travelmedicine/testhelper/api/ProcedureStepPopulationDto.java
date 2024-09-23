/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.testhelper.api;

import de.eshg.travelmedicine.vaccinationconsultation.api.PostProcedureStepRequest;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

@Schema(
    name = "ProcedureStepPopulation",
    description =
        "request the creation of one more procedure step/appointment, including the services to be attached to it")
public record ProcedureStepPopulationDto(
    @NotBlank String stepKey,
    @NotNull @Size(min = 1) List<@NotBlank String> serviceKeys,
    @Schema(
            description =
                "note: the list of service IDs will be ignored since it's assembled from the service keys and injected to the actual request")
        @NotNull
        @Valid
        PostProcedureStepRequest request) {}
