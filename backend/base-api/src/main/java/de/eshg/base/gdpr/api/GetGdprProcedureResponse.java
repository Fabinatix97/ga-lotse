/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.gdpr.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.UUID;

public record GetGdprProcedureResponse(
    @Schema(
            description = "The Id of the GDPR procedure.",
            example = "ae9831d4-dc25-48d8-9bfe-4c0b54bfb2c1")
        @NotNull
        UUID id,
    @Schema(
            description =
                "Version of the entity. Each time the entity is changed, it is incremented by one.")
        @NotNull
        long version,
    @Schema(
            description =
                "The Id of a set of Reference Data from the Central Files that shall be processed in this GDPR procedure.",
            example = "be9831d4-dc25-48d8-9bfe-4c0b54bfb2c1")
        UUID centralFileId,
    @NotNull GdprProcedureStatusDto status,
    @NotNull GdprProcedureTypeDto type,
    @NotNull @Valid GdprIdentificationDataDto identificationData,
    @Schema(
            description = "The date and time of when the GDPR procedure was created.",
            example = "2024-02-01T00:00:00.123456Z")
        @NotNull
        Instant createdAt,
    @Schema(
            description =
                "The matter of concern for this GDPR procedure, only relevant for right to correction and right to objection.",
            example = "Person requested to stop all related procedures.")
        String matterOfConcern,
    @Schema(
            description =
                "The internal note used to define the result of a procedure when closing or cancelling.",
            example = "Could not find any datasets to correct, likely already deleted.")
        String internalNote) {}
