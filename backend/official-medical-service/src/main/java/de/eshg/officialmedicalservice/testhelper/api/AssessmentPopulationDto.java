/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.officialmedicalservice.testhelper.api;

import de.eshg.officialmedicalservice.assessment.api.AssessmentResultDto;
import de.eshg.officialmedicalservice.assessment.api.AssessmentStatusDto;
import de.eshg.officialmedicalservice.assessment.api.AssessmentTypeDto;
import de.eshg.officialmedicalservice.assessment.api.RecipientTypeDto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(name = "AssessmentPopulation")
public record AssessmentPopulationDto(
    @NotNull String title,
    String summary,
    String jsonContent,
    String htmlContent,
    AssessmentResultDto assessmentResult,
    @NotNull AssessmentTypeDto assessmentType,
    AssessmentStatusDto assessmentStatus,
    RecipientTypeDto recipientType) {

  public AssessmentPopulationDto(
      String title,
      AssessmentResultDto assessmentResult,
      AssessmentTypeDto assessmentType,
      AssessmentStatusDto assessmentStatus) {
    this(title, "", "", "", assessmentResult, assessmentType, assessmentStatus, null);
  }
}
