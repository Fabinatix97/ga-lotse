/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.gdpr.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.UUID;

@Schema(
    name = "CitizenUsersGdprProcedure",
    description = "The core data of a GdprProcedure used in a response to a query by a CitizenUser")
public record CitizenUsersGdprProcedureDto(
    @Schema(
            description = "The Id of the GDPR procedure.",
            example = "ae9831d4-dc25-48d8-9bfe-4c0b54bfb2c1")
        @NotNull
        UUID id,
    @NotNull GdprProcedureTypeDto type,
    @NotNull GdprProcedureStatusDto status,
    @Schema(
            description = "The matter of concern specified by the requesting user.",
            example = "Please stop all procedures related to my personal information.")
        String matterOfConcern,
    @Schema(description = "Whether this procedure has available downloads.", example = "true")
        @NotNull
        boolean hasDownloads,
    @Schema(
            description = "The date and time of when the GDPR procedure was created.",
            example = "2024-02-01T00:00:00.123456Z")
        @NotNull
        Instant createdAt,
    @Schema(
            description =
                "The date and time of when this GDPR procedure was completed or cancelled.",
            example = "2024-02-01T00:00:00.123456Z")
        Instant closedAt) {}
