/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.medicalhistory;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.PositiveOrZero;
import java.time.LocalDate;

@Schema(name = SexWorkMedicalHistoryDto.SCHEMA_NAME)
public record SexWorkMedicalHistoryDto(
    String examinationReason,
    String currentSymptoms,
    @PastOrPresent LocalDate contactToClarifyDate,
    RelationshipModelDto relationshipModel,
    @PastOrPresent @Schema(description = "The date when the patient last experienced menstruation.")
        LocalDate lastMenstruationDate,
    @PastOrPresent @Schema(description = "The date of the patient's most recent cancer screening.")
        LocalDate lastCancerScreeningDate,
    @Schema(description = "Indicates if the patient was previously pregnant.")
        Boolean previouslyPregnant,
    @PositiveOrZero
        @Schema(
            description = "Specifies the total number of pregnancies the patient had.",
            example = "3")
        Integer amountPregnancies,
    @PositiveOrZero
        @Schema(
            description = "Specifies the total number of abortions the patient has undergone.",
            example = "1")
        Integer amountAbortions,
    @Schema(
            description = "A description of known past surgeries or operations.",
            example = "Appendectomy in 2015.")
        String knownOperations,
    @Schema(
            description = "A list of current or relevant medications the patient is taking.",
            example = "Lisinopril 10mg daily.")
        String medications,
    @Valid ExaminationDto examinations,
    @Valid PreviousIllnessDto previousIllnesses,
    @Valid RiskContactDto riskContacts,
    @Valid SexWorkRiskContactDto sexWorkRiskContacts,
    @Valid PreventionDto prevention,
    @Valid RiskFactorDto riskFactors,
    String additionalComments)
    implements MedicalHistoryDto {

  static final String SCHEMA_NAME = "SexWorkMedicalHistory";

  @Override
  public String type() {
    return SCHEMA_NAME;
  }
}
