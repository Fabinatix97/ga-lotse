/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.mapper;

import de.eshg.measlesprotection.api.ReportDataDto;
import de.eshg.measlesprotection.api.ReportingReasonDto;
import de.eshg.measlesprotection.api.UpdateReportDataDto;
import de.eshg.measlesprotection.persistence.db.ReportData;
import de.eshg.measlesprotection.persistence.db.ReportingReason;
import org.apache.commons.lang3.ObjectUtils;

public class ReportDataMapper {

  private ReportDataMapper() {}

  public static ReportDataDto toInterfaceType(ReportData reportData) {
    if (reportData == null) {
      return null;
    }
    return new ReportDataDto(
        reportData.reportingDate(),
        ReportingReasonMapper.toInterfaceType(reportData.reportingReason()),
        reportData.commentReportingReason());
  }

  public static ReportData toDatabaseType(ReportDataDto reportDataDto) {
    return new ReportData(
        reportDataDto.reportingDate(),
        ReportingReasonMapper.toDatabaseType(reportDataDto.reportingReason()),
        reportDataDto.commentReportingReason());
  }

  public static ReportData toDatabaseType(UpdateReportDataDto update, ReportData original) {
    ReportingReason reportingReason = updateReportingReason(update, original);
    return new ReportData(
        ObjectUtils.defaultIfNull(update.reportingDate(), original.reportingDate()),
        reportingReason,
        updateCommentReportingReason(update, reportingReason));
  }

  private static String updateCommentReportingReason(
      UpdateReportDataDto update, ReportingReason reason) {
    if (reason == ReportingReason.OTHER) {
      return update.commentReportingReason();
    } else {
      return null;
    }
  }

  private static ReportingReason updateReportingReason(
      UpdateReportDataDto update, ReportData original) {
    final ReportingReasonDto reportingReasonDto = update.reportingReason();
    if (reportingReasonDto != null) {
      return ReportingReasonMapper.toDatabaseType(reportingReasonDto);
    } else {
      return original.reportingReason();
    }
  }
}
