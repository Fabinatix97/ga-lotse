/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.procedure.model.gdpr;

import de.eshg.lib.procedure.model.ProcedureDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

@Schema(name = "BusinessProcedureWithInclusionStatus")
public record BusinessProcedureWithInclusionStatusDto(
    @Valid @NotNull ProcedureDto businessProcedure,
    @NotNull BusinessProcedureInclusionStatusDto inclusionStatus) {}
