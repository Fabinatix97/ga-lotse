/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.api;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(
    name = "CaseStatus",
    description = "Indicates the current status of the procedure or the final outcome.")
public enum CaseStatusDto {
  PROCEDURE_VALIDATION,
  PROCEDURE_RECORDED,
  LETTER_SEND,
  FOLLOW_UP_LETTER_SEND,
  APPOINTMENT_BOOKED,
  FOLLOW_UP_APPOINTMENT,
  PROOF_SUBMITTED,
  ATTENDED_NO_PROOF,
  REPORT_WITHDRAWN,
  PERSON_NOT_ACTIVE,
  PERSON_TEMP_NOT_ACTIVE,
  MEDICAL_ATTEST,
  TEMP_MEDICAL_ATTEST,
  AUTHORITY_HANDOVER,
  ACCESS_RESTRICTED,
  INDIVIDUAL_REVIEW,
}
