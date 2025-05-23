/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medsabroad.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record MedsAbroadProcedurePopulationResponse(
    @Valid List<CreateMedsAbroadProcedureResponse> procedures, @NotNull long count) {}
