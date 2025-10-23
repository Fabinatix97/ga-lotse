/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.api.medicalhistory;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonSubTypes.Type;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import de.eshg.api.commons.HasTypeDiscriminator;
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
  @Schema(
      description = "Specifies the reason for the patient's appointment.",
      example = "Lower Abdominal Pain")
  String examinationReason();

  @Schema(
      description = "Details the symptoms the patient is currently experiencing.",
      example = "Dysuria")
  String currentSymptoms();

  @Schema(
      description = "Records the date of the contact the patients wished to discuss or clarify.")
  LocalDate contactToClarifyDate();

  @Schema(description = "Provides details on the patient's relationship model.", example = "OPEN")
  RelationshipModelDto relationshipModel();

  // Examinations
  @Schema(
      description = "Contains information about any examinations the patient previously undergone.")
  ExaminationDto examinations();

  // Previous Illness
  @Schema(description = "Lists any past illnesses the patient had.")
  PreviousIllnessDto previousIllnesses();

  // Orientation and Contact
  @Schema(
      description =
          "Details information regarding the patient's contact with potentially risky partners.")
  RiskContactDto riskContacts();

  // Prevention
  @Schema(
      description =
          "Details information regarding the patient's prevention strategies and measures.")
  PreventionDto prevention();

  // Risk Factors
  @Schema(
      description =
          "Details information about the patient's behaviors or actions that may pose risk factors.")
  RiskFactorDto riskFactors();

  // Comments
  @Schema(description = "An optional field for recording any additional remarks or comments.")
  String additionalComments();
}
