/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.dental.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(name = "ToothDiagnosis")
public record ToothDiagnosisDto(
    @NotNull ToothDto tooth,
    @NotNull MainResultDto mainResult,
    SecondaryResultDto secondaryResult1,
    SecondaryResultDto secondaryResult2) {}
