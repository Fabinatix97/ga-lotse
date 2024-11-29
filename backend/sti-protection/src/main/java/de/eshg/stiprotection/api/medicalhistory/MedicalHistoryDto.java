/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.medicalhistory;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonSubTypes.Type;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import de.eshg.base.HasTypeDiscriminator;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;

@Schema(name = "MedicalHistory")
@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    property = "@type",
    include = JsonTypeInfo.As.EXISTING_PROPERTY)
@JsonSubTypes({
  @Type(
      value = StiConsultationMedicalHistoryDto.class,
      name = StiConsultationMedicalHistoryDto.SCHEMA_NAME),
  @Type(value = SexWorkMedicalHistoryDto.class, name = SexWorkMedicalHistoryDto.SCHEMA_NAME)
})
public sealed interface MedicalHistoryDto extends HasTypeDiscriminator
    permits StiConsultationMedicalHistoryDto, SexWorkMedicalHistoryDto {

  // General

  String examinationReason();

  String currentSymptoms();

  LocalDate contactToClarifyDate();

  RelationshipModelDto relationshipModel();

  // Examinations

  ExaminationDto examinations();

  // Previous Illness

  PreviousIllnessDto previousIllnesses();

  // Orientation and Contact

  RiskContactDto riskContacts();

  // Prevention

  PreventionDto prevention();

  // Risk Factors

  RiskFactorDto riskFactors();

  // Comments

  String additionalComments();
}
