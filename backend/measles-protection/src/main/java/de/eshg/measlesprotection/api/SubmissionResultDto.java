/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(
    name = "SubmissionResult",
    description =
        """
        The SubmissionResult describes the current state and the final outcome of a proof submission.
        """)
public enum SubmissionResultDto {
  UNDER_REVIEW,
  ATTENDED_NO_PROOF,
  TEMP_MEDICAL_ATTEST,
  MEDICAL_ATTEST,
  PROOF_SUBMITTED
}
