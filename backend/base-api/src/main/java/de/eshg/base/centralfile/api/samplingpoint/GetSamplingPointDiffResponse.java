/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.api.samplingpoint;

import de.eshg.base.centralfile.api.DiffDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record GetSamplingPointDiffResponse(
    @Schema(description = "The version of the reference sampling point") @NotNull @Min(0)
        Long referenceVersion,
    @Valid @NotNull DiffDto<SamplingPointDetailsDto> samplingPointDetailsDiff) {}
