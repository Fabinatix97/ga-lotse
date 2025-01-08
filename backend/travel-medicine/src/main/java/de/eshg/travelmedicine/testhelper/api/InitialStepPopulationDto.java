/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.testhelper.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import java.util.List;

@Schema(
    name = "InitialStepPopulation",
    description =
        "request some services to be attached to the procedure's initial step/appointment, also assign a key to the initial step")
public record InitialStepPopulationDto(@NotBlank String initialStepKey, List<String> serviceKeys) {}
