/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.mapper;

import de.eshg.measlesprotection.api.CaseStatusDto;
import de.eshg.measlesprotection.persistence.db.CaseStatus;

public class CaseStatusMapper {

  private CaseStatusMapper() {}

  public static CaseStatusDto toInterfaceType(CaseStatus caseStatus) {
    return switch (caseStatus) {
      case PROCEDURE_VALIDATION -> CaseStatusDto.PROCEDURE_VALIDATION;
      case PROCEDURE_RECORDED -> CaseStatusDto.PROCEDURE_RECORDED;
      case LETTER_SEND -> CaseStatusDto.LETTER_SEND;
      case FOLLOW_UP_LETTER_SEND -> CaseStatusDto.FOLLOW_UP_LETTER_SEND;
      case APPOINTMENT_BOOKED -> CaseStatusDto.APPOINTMENT_BOOKED;
      case FOLLOW_UP_APPOINTMENT -> CaseStatusDto.FOLLOW_UP_APPOINTMENT;
      case PROOF_SUBMITTED -> CaseStatusDto.PROOF_SUBMITTED;
      case ATTENDED_NO_PROOF -> CaseStatusDto.ATTENDED_NO_PROOF;
      case REPORT_WITHDRAWN -> CaseStatusDto.REPORT_WITHDRAWN;
      case PERSON_NOT_ACTIVE -> CaseStatusDto.PERSON_NOT_ACTIVE;
      case PERSON_TEMP_NOT_ACTIVE -> CaseStatusDto.PERSON_TEMP_NOT_ACTIVE;
      case MEDICAL_ATTEST -> CaseStatusDto.MEDICAL_ATTEST;
      case TEMP_MEDICAL_ATTEST -> CaseStatusDto.TEMP_MEDICAL_ATTEST;
      case AUTHORITY_HANDOVER -> CaseStatusDto.AUTHORITY_HANDOVER;
      case ACCESS_RESTRICTED -> CaseStatusDto.ACCESS_RESTRICTED;
      case INDIVIDUAL_REVIEW -> CaseStatusDto.INDIVIDUAL_REVIEW;
    };
  }

  public static CaseStatus toDatabaseType(CaseStatusDto reportingReason) {
    return switch (reportingReason) {
      case PROCEDURE_VALIDATION -> CaseStatus.PROCEDURE_VALIDATION;
      case PROCEDURE_RECORDED -> CaseStatus.PROCEDURE_RECORDED;
      case LETTER_SEND -> CaseStatus.LETTER_SEND;
      case FOLLOW_UP_LETTER_SEND -> CaseStatus.FOLLOW_UP_LETTER_SEND;
      case APPOINTMENT_BOOKED -> CaseStatus.APPOINTMENT_BOOKED;
      case FOLLOW_UP_APPOINTMENT -> CaseStatus.FOLLOW_UP_APPOINTMENT;
      case PROOF_SUBMITTED -> CaseStatus.PROOF_SUBMITTED;
      case ATTENDED_NO_PROOF -> CaseStatus.ATTENDED_NO_PROOF;
      case REPORT_WITHDRAWN -> CaseStatus.REPORT_WITHDRAWN;
      case PERSON_NOT_ACTIVE -> CaseStatus.PERSON_NOT_ACTIVE;
      case PERSON_TEMP_NOT_ACTIVE -> CaseStatus.PERSON_TEMP_NOT_ACTIVE;
      case MEDICAL_ATTEST -> CaseStatus.MEDICAL_ATTEST;
      case TEMP_MEDICAL_ATTEST -> CaseStatus.TEMP_MEDICAL_ATTEST;
      case AUTHORITY_HANDOVER -> CaseStatus.AUTHORITY_HANDOVER;
      case ACCESS_RESTRICTED -> CaseStatus.ACCESS_RESTRICTED;
      case INDIVIDUAL_REVIEW -> CaseStatus.INDIVIDUAL_REVIEW;
    };
  }
}
