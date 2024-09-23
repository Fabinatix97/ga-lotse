/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

@Schema(name = "CreateProofSubmission")
public record CreateProofSubmissionDto(
    @NotNull SubmissionResultDto submissionResult,
    @NotNull LocalDate submissionDate,
    LocalDate medicalAttestDeadline)
    implements ProofSubmissionBaseDto {}
