/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medsabroad.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record CreateMedsAbroadProcedureResponse(
    @Schema(description = "An unique identifier for the meds abroad procedure.") @NotNull
        UUID procedureId) {}
