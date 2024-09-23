/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.UUID;

@Schema(name = "ProofSubmission")
public record ProofSubmissionDto(
    @NotNull
        @Schema(
            description = "The unique identifier for the proof submission.",
            example = "31bdeb5d-4d00-4cf2-a001-4634e9396050")
        UUID externalId,
    @NotNull SubmissionResultDto submissionResult,
    @NotNull LocalDate submissionDate,
    LocalDate medicalAttestDeadline,
    UUID proofSubmissionDocumentId)
    implements ProofSubmissionBaseDto {}
