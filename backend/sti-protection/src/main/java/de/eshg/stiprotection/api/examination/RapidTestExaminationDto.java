/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.examination;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotNull;

@Schema(name = "RapidTestExamination")
public record RapidTestExaminationDto(
    String generalComments,
    @NotNull Boolean testsPayed,
    @NotNull Boolean hivRequested,
    @NotNull Boolean syphilisRequested,
    @NotNull Boolean pregnancyTestRequested,
    @NotNull Boolean ultrasoundRequested,
    @NotNull Boolean bloodPressureRequested,
    @NotNull Boolean pulseRequested,
    @NotNull Boolean urinalysisRequested,
    @Valid RapidTestDataDto hivData,
    @Valid RapidTestDataDto syphilisData,
    @Valid RapidTestDataDto pregnancyTestData,
    String ultrasoundData,
    String bloodPressureData,
    String pulseData,
    String urinalysisData) {

  @AssertTrue(message = "A test not requested must not have data.")
  @JsonIgnore
  public boolean isValidTestData() {
    return (hivRequested || hivData == null)
        && (syphilisRequested || syphilisData == null)
        && (pregnancyTestRequested || pregnancyTestData == null)
        && (ultrasoundRequested || ultrasoundData == null)
        && (bloodPressureRequested || bloodPressureData == null)
        && (pulseRequested || pulseData == null)
        && (urinalysisRequested || urinalysisData == null);
  }
}
