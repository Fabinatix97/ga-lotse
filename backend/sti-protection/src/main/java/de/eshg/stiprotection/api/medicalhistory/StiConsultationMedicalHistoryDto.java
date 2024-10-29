/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.medicalhistory;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import java.time.LocalDate;

@Schema(name = StiConsultationMedicalHistoryDto.SCHEMA_NAME)
public record StiConsultationMedicalHistoryDto(
    String examinationReason,
    String currentSymptoms,
    @PastOrPresent LocalDate contactToClarifyDuration,
    RelationshipModelDto relationshipModel,
    @Valid ExaminationDto examinations,
    @NotNull @Valid PreviousIllnessDto previousIllnesses,
    @Valid RiskContactDto riskContacts,
    @NotNull @Valid RiskFactorDto riskFactors,
    String additionalComments)
    implements MedicalHistoryDto {

  static final String SCHEMA_NAME = "StiConsultationMedicalHistory";

  @Override
  public String type() {
    return SCHEMA_NAME;
  }
}
