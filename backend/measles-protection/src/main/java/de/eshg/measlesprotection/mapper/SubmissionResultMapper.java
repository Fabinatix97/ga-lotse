/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.mapper;

import de.eshg.measlesprotection.api.SubmissionResultDto;
import de.eshg.measlesprotection.persistence.db.SubmissionResult;

public class SubmissionResultMapper {

  private SubmissionResultMapper() {}

  public static SubmissionResult toDatabaseType(
      de.eshg.measlesprotection.api.SubmissionResultDto submissionResultDto) {
    return switch (submissionResultDto) {
      case UNDER_REVIEW -> SubmissionResult.UNDER_REVIEW;
      case ATTENDED_NO_PROOF -> SubmissionResult.ATTENDED_NO_PROOF;
      case TEMP_MEDICAL_ATTEST -> SubmissionResult.TEMP_MEDICAL_ATTEST;
      case MEDICAL_ATTEST -> SubmissionResult.MEDICAL_ATTEST;
      case PROOF_SUBMITTED -> SubmissionResult.PROOF_SUBMITTED;
    };
  }

  public static SubmissionResultDto toInterfaceType(SubmissionResult submissionResult) {
    return switch (submissionResult) {
      case UNDER_REVIEW -> SubmissionResultDto.UNDER_REVIEW;
      case ATTENDED_NO_PROOF -> SubmissionResultDto.ATTENDED_NO_PROOF;
      case TEMP_MEDICAL_ATTEST -> SubmissionResultDto.TEMP_MEDICAL_ATTEST;
      case MEDICAL_ATTEST -> SubmissionResultDto.MEDICAL_ATTEST;
      case PROOF_SUBMITTED -> SubmissionResultDto.PROOF_SUBMITTED;
    };
  }
}
