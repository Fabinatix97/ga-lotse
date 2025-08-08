/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@Schema(name = "GetSchoolEntryLabelsResponse")
public record GetProcedureLabelsResponse(
    @NotNull @Valid List<ProcedureLabelDto> labels, @NotNull long totalNumberOfElements) {}
