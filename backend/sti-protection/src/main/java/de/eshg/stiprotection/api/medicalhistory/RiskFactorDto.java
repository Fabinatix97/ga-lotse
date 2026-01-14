/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.medicalhistory;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.PastOrPresent;
import java.time.LocalDate;

@Schema(name = "RiskFactors")
public record RiskFactorDto(
    @Schema(
            description =
                "Records if the patient engaged in vaginal intercourse that may pose a risk.")
        Boolean riskActivityDateVaginalIntercourse,
    @Schema(
            description =
                "Records if the patient engaged in oral intercourse that may pose a risk.")
        Boolean riskActivityDateOralIntercourse,
    @Schema(
            description =
                "Records if the patient engaged in anal intercourse that may pose a risk.")
        Boolean riskActivityDateAnalIntercourse,
    @Schema(description = "Records if the patient engaged in other risk-related activities.")
        Boolean otherRiskActivities,
    @Schema(
            description =
                "Records the most recent date the patient engaged in vaginal intercourse.")
        @PastOrPresent
        LocalDate riskActivityDateVaginalIntercourseDate,
    @Schema(description = "Records the most recent date the patient engaged in oral intercourse.")
        @PastOrPresent
        LocalDate riskActivityDateOralIntercourseDate,
    @Schema(description = "Records the most recent date the patient engaged in anal intercourse.")
        @PastOrPresent
        LocalDate riskActivityDateAnalIntercourseDate,
    @Schema(
            description =
                "Provides details on any other risk-related activities the patient has participated.")
        String otherRiskActivitiesData) {}
