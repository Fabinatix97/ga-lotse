/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.consultation;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.AssertFalse;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.PositiveOrZero;
import java.time.LocalDate;

@Schema(
    name = "ConsultationPregnancySection",
    description =
        "Pregnancy-related details, including the number of previous pregnancies and abortions.")
public record PregnancySectionDto(
    @Schema(description = "Indicates whether pregnancy-related information is provided.")
        Boolean hasPregnancyRelatedInfo,
    @PastOrPresent()
        @Schema(
            description = "Date of the patient's most recent cytology test.",
            example = "2023-05-08")
        LocalDate lastCytologyTest,
    @PastOrPresent()
        @Schema(
            description = "Start date of the patient's last menstrual period.",
            example = "2024-12-01")
        LocalDate startOfLastPeriod,
    @PositiveOrZero()
        @Schema(description = "Total number of pregnancies the patient had.", example = "6")
        Integer numberOfPregnancies,
    @PositiveOrZero()
        @Schema(description = "Number of induced abortions the patient had.", example = "2")
        Integer numberOfInducedAbortions,
    @PositiveOrZero()
        @Schema(description = "Total number of births the patient had.", example = "3")
        Integer numberOfBirths,
    @PositiveOrZero()
        @Schema(description = "Number of abortions due to other reasons.", example = "1")
        Integer numberOfOtherAbortions,
    @PositiveOrZero()
        @Schema(
            description = "Number of ectopic pregnancies, developed outside the uterus.",
            example = "1")
        Integer numberOfEctopicPregnancies) {

  @AssertFalse(
      message =
          "If hasPregnancyRelatedInfo is set to false or null, all other pregnancy section fields should be null.")
  @JsonIgnore
  @SuppressWarnings("unused")
  public boolean isFilledPregnancySectionWithHasPregnancyRelatedInfoSetToFalse() {
    return Boolean.TRUE.equals(hasPregnancyRelatedInfo())
        && lastCytologyTest() == null
        && startOfLastPeriod() == null
        && numberOfPregnancies() == null
        && numberOfInducedAbortions() == null
        && numberOfBirths() == null
        && numberOfOtherAbortions() == null
        && numberOfEctopicPregnancies() == null;
  }
}
