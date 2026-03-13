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

public record GetSamplingPointFileStateResponse(
    @Schema(
            description = "Id of the SamplingPoint.",
            example = "ae9831d4-dc25-48d8-9bfe-4c0b54bfb2c1")
        @NotNull
        UUID id,
    @NotNull @Size(min = 1, max = 300) String name,
    @Size(min = 1, max = 300) String zid,
    UUID facilityId,
    @Schema(
            description =
                "The version of referenceData that was present when the FileState was created. Can be increased if a newer version is irrelevant for the Procedure and the outdated flag shall be suppressed.",
            example = "1")
        @NotNull
        Long referenceVersion,
    @Schema(
            description =
                "A flag that signals if a File State differs from the referenceFacility it is connected to.",
            example = "true")
        Boolean outdated,
    @NotNull DataOriginDto dataOrigin)
    implements SamplingPointDetails {}
