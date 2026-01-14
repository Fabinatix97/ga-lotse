/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.api;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.AssertTrue;
import java.time.LocalDate;

@Schema(name = "UpdateReportData")
public record UpdateReportDataDto(
    LocalDate reportingDate, ReportingReasonDto reportingReason, String commentReportingReason)
    implements ReportingReasonDtoAware {
  @AssertTrue
  @JsonIgnore
  @SuppressWarnings("unused")
  public boolean isUpdateReportDataValid() {
    return (reportingDate != null || reportingReason != null) && isReportingReasonValid();
  }
}
