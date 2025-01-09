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

@Schema(
    name = "RapidTestExamination",
    description =
        "Used to document the initial request which laboratory tests should be performed and to record the corresponding results.")
public record RapidTestExaminationDto(
    @Schema(
            description = "Provides general comments related to the rapid tests.",
            example = "Faint test line observed. Confirmation with laboratory test recommended.")
        String generalComments,
    @Schema(description = "Indicates whether the patient has paid for the tests.") @NotNull
        Boolean testsPayed,
    @Schema(description = "Specifies whether an HIV rapid test is requested.") @NotNull
        Boolean hivRequested,
    @Schema(description = "Specifies whether a Syphilis rapid test is requested.") @NotNull
        Boolean syphilisRequested,
    @Schema(description = "Specifies whether a pregnancy test is requested.") @NotNull
        Boolean pregnancyTestRequested,
    @Schema(description = "Specifies whether an ultrasound examination is requested.") @NotNull
        Boolean ultrasoundRequested,
    @Schema(description = "Specifies whether blood pressure measurement is requested.") @NotNull
        Boolean bloodPressureRequested,
    @Schema(description = "Specifies whether pulse measurement is requested.") @NotNull
        Boolean pulseRequested,
    @Schema(description = "Specifies whether an urinalysis is requested.") @NotNull
        Boolean urinalysisRequested,
    @Valid RapidTestDataDto hivData,
    @Valid RapidTestDataDto syphilisData,
    @Valid RapidTestDataDto pregnancyTestData,
    @Schema(
            description = "Records the results of the ultrasound examination.",
            example = "Gestational age: 12 weeks 3 days.")
        String ultrasoundData,
    @Schema(description = "Records the measured blood pressure values.", example = "120/80 mmHg.")
        String bloodPressureData,
    @Schema(description = "Is used to document the measured pulse.", example = "72 bpm.")
        String pulseData,
    @Schema(
            description = "Is used to document the urinalysis information.",
            example = "Appearance: Clear, Color: Yellow, pH: 6.5.")
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
