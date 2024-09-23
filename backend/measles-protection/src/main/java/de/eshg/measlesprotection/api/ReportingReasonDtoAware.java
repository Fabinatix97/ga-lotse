/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.api;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.constraints.AssertTrue;
import org.apache.commons.lang3.StringUtils;
import org.springframework.validation.annotation.Validated;

@Validated
public interface ReportingReasonDtoAware {

  ReportingReasonDto reportingReason();

  String commentReportingReason();

  @AssertTrue(message = "Comment must be provided for reporting reason OTHER only.")
  @JsonIgnore
  @SuppressWarnings("unused")
  default boolean isReportingReasonValid() {
    if (reportingReason() == ReportingReasonDto.OTHER) {
      return StringUtils.isNotBlank(commentReportingReason());
    } else {
      return StringUtils.isBlank(commentReportingReason());
    }
  }
}
