/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.api;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.AssertTrue;
import java.time.LocalDate;

public interface ProofSubmissionBaseDto {
  @Schema(
      description = "The result and also state of the potentially submitted proof.",
      example = "PROOF_SUBMITTED")
  SubmissionResultDto submissionResult();

  @Schema(description = "The date of the proof submission.", example = "2024-06-03")
  LocalDate submissionDate();

  @Schema(
      description = "Indicates a deadline when a temporary medical attest was provided.",
      example = "2024-07-17")
  LocalDate medicalAttestDeadline();

  @AssertTrue(message = "Medical attest deadline is required for temp medical attest only")
  @JsonIgnore
  @SuppressWarnings("unused")
  default boolean isProofSubmissionValid() {
    return (submissionResult() == SubmissionResultDto.TEMP_MEDICAL_ATTEST
            && medicalAttestDeadline() != null)
        || (submissionResult() != SubmissionResultDto.TEMP_MEDICAL_ATTEST
            && medicalAttestDeadline() == null);
  }
}
