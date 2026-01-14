/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.api;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.AssertTrue;
import java.time.LocalDate;

@Schema(name = "UpdateProofSubmission")
public record UpdateProofSubmissionDto(
    SubmissionResultDto submissionResult, LocalDate submissionDate, LocalDate medicalAttestDeadline)
    implements ProofSubmissionBaseDto {

  @AssertTrue(message = "At least submissionResult or submissionDate is required")
  @JsonIgnore
  @SuppressWarnings("unused")
  public boolean isUpdateProofSubmissionValid() {
    return (submissionResult != null || submissionDate != null) && isProofSubmissionValid();
  }
}
