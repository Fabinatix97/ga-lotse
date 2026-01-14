/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.examination;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;

@Schema(name = "LaboratoryTestSamples")
public record LaboratoryTestSamplesDto(
    @Schema(description = "Specifies whether an oral sample is requested.")
        Boolean oralSampleRequested,
    @Valid LaboratoryTestDto oralSampleData,
    @Schema(description = "Specifies whether an urethral sample is requested.")
        Boolean urethralSampleRequested,
    @Valid LaboratoryTestDto urethralSampleData,
    @Schema(description = "Specifies whether an anal sample is requested.")
        Boolean analSampleRequested,
    @Valid LaboratoryTestDto analSampleData) {}
