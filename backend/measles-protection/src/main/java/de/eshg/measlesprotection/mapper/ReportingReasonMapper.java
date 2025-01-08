/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.mapper;

import de.eshg.measlesprotection.api.ReportingReasonDto;
import de.eshg.measlesprotection.persistence.db.ReportingReason;

public class ReportingReasonMapper {

  private ReportingReasonMapper() {}

  public static ReportingReasonDto toInterfaceType(ReportingReason reportingReason) {
    return switch (reportingReason) {
      case NO_PROOF -> ReportingReasonDto.NO_PROOF;
      case FIRST_VACCINE -> ReportingReasonDto.FIRST_VACCINE;
      case MEDICAL_CONTRAINDICATION -> ReportingReasonDto.MEDICAL_CONTRAINDICATION;
      case UNASSESSABLE_PROOF -> ReportingReasonDto.UNASSESSABLE_PROOF;
      case OTHER -> ReportingReasonDto.OTHER;
    };
  }

  public static ReportingReason toDatabaseType(ReportingReasonDto reportingReason) {
    return switch (reportingReason) {
      case NO_PROOF -> ReportingReason.NO_PROOF;
      case FIRST_VACCINE -> ReportingReason.FIRST_VACCINE;
      case MEDICAL_CONTRAINDICATION -> ReportingReason.MEDICAL_CONTRAINDICATION;
      case UNASSESSABLE_PROOF -> ReportingReason.UNASSESSABLE_PROOF;
      case OTHER -> ReportingReason.OTHER;
    };
  }
}
