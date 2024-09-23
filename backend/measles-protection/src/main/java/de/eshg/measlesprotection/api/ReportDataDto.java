/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

@Schema(name = "ReportData")
public record ReportDataDto(
    @NotNull
        @Schema(
            description = "The date on which the report was transmitted.",
            example = "2024-06-03")
        LocalDate reportingDate,
    @NotNull @Schema(description = "The reason why the person was reported.", example = "NO_PROOF")
        ReportingReasonDto reportingReason,
    @Schema(
            description = "Additional comment if the reporting reason is not listed.",
            example = "Special not listed reason.")
        String commentReportingReason)
    implements ReportingReasonDtoAware {}
