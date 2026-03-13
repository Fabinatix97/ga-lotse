/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.centralfile.api.samplingpoint;

import de.eshg.base.centralfile.api.DataOriginDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.UUID;

public record AddSamplingPointFileStateResponse(
    @Schema(
            description = "The Id of the Sampling Point.",
            example = "ae9831d4-dc25-48d8-9bfe-4c0b54bfb2c1")
        @NotNull
        UUID id,
    @NotNull @Size(min = 1, max = 300) String name,
    String zid,
    UUID facilityId,
    String facilityName,
    @NotNull DataOriginDto dataOrigin,
    @NotNull long version)
    implements SamplingPointDetails {}
