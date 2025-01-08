/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record GetDetailedProcedureResponse(
    @NotNull @Valid ProcedureDto procedure,
    @NotNull @Valid List<DetailedPersonDto> persons,
    @NotNull @Valid List<DetailedFacilityDto> facilities,
    @NotNull @Valid List<DetailedTaskDto> tasks) {}
