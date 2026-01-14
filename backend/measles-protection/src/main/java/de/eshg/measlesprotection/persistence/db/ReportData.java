/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.persistence.db;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Transient;
import jakarta.validation.constraints.AssertTrue;
import java.time.LocalDate;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@Embeddable
public record ReportData(
    @DataSensitivity(SensitivityLevel.PSEUDONYMIZED) LocalDate reportingDate,
    @DataSensitivity(SensitivityLevel.PSEUDONYMIZED) @JdbcType(PostgreSQLEnumJdbcType.class)
        ReportingReason reportingReason,
    @DataSensitivity(SensitivityLevel.SENSITIVE) String commentReportingReason) {
  @AssertTrue(message = "Comment must be provided for reporting reason OTHER only.")
  @Transient
  @SuppressWarnings("unused")
  boolean isReportingReasonValid() {
    if (reportingReason == ReportingReason.OTHER) {
      return StringUtils.isNotBlank(commentReportingReason);
    } else {
      return StringUtils.isBlank(commentReportingReason);
    }
  }
}
