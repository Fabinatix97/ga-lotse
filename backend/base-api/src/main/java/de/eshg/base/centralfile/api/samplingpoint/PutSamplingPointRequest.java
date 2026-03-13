/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.api.samplingpoint;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

@Schema(
    description =
        "Request used for performing a consistent update of file state and associated reference sampling point")
public record PutSamplingPointRequest(
    @NotNull @Valid SamplingPointDetailsDto updatedSamplingPoint) {}
