/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@Schema(name = "GetDentalLabelsResponse")
public record GetProcedureLabelsResponse(
    @NotNull @Valid List<ProcedureLabelDto> labels, @NotNull long totalNumberOfElements) {}
