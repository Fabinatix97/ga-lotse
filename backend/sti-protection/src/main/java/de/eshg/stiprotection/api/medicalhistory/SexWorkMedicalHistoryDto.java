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
    @PastOrPresent LocalDate lastMenstruationDate,
    @PastOrPresent LocalDate lastCancerScreeningDate,
    Boolean previouslyPregnant,
    @PositiveOrZero Integer amountPregnancies,
    @PositiveOrZero Integer amountAbortions,
    String knownOperations,
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
