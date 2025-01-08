/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.examination;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;

@Schema(name = "LaboratoryTestSamples")
public record LaboratoryTestSamplesDto(
    Boolean oralSampleRequested,
    @Valid LaboratoryTestDto oralSampleData,
    Boolean urethralSampleRequested,
    @Valid LaboratoryTestDto urethralSampleData,
    Boolean analSampleRequested,
    @Valid LaboratoryTestDto analSampleData) {}
