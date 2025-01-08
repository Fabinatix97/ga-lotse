/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.mapper.medicalhistory;

import de.eshg.rest.service.error.BadRequestException;
import de.eshg.stiprotection.api.medicalhistory.MedicalHistoryDto;
import de.eshg.stiprotection.api.medicalhistory.SexWorkMedicalHistoryDto;
import de.eshg.stiprotection.api.medicalhistory.StiConsultationMedicalHistoryDto;
import de.eshg.stiprotection.persistence.db.medicalhistory.MedicalHistory;
import de.eshg.stiprotection.persistence.db.medicalhistory.SexWorkMedicalHistory;
import de.eshg.stiprotection.persistence.db.medicalhistory.StiConsultationMedicalHistory;

public final class MedicalHistoryMapper {
  private MedicalHistoryMapper() {}

  public static MedicalHistoryDto toInterfaceType(MedicalHistory entity) {
    if (entity == null) {
      return null;
    }

    return switch (entity) {
      case StiConsultationMedicalHistory consultation -> toInterfaceType(consultation);
      case SexWorkMedicalHistory sexWork -> toInterfaceType(sexWork);
      default -> throw new IllegalArgumentException("Unexpected value: " + entity.getClass());
    };
  }

  private static MedicalHistoryDto toInterfaceType(SexWorkMedicalHistory entity) {
    return new SexWorkMedicalHistoryDto(
        entity.getExaminationReason(),
        entity.getCurrentSymptoms(),
        entity.getContactToClarifyDate(),
        RelationshipModelMapper.toInterfaceType(entity.getRelationshipModel()),
        entity.getLastMenstruationDate(),
        entity.getLastCancerScreeningDate(),
        entity.getPreviouslyPregnant(),
        entity.getAmountPregnancies(),
        entity.getAmountAbortions(),
        entity.getKnownOperations(),
        entity.getMedications(),
        ExaminationMapper.toInterfaceType(entity.getExaminations()),
        PreviousIllnessMapper.toInterfaceType(entity.getPreviousIllnesses()),
        RiskContactMapper.toInterfaceType(entity.getRiskContacts()),
        SexWorkRiskContactMapper.toInterfaceType(entity.getSexWorkRiskContacts()),
        PreventionMapper.toInterfaceType(entity.getPrevention()),
        RiskFactorMapper.toInterfaceType(entity.getRiskFactors()),
        entity.getAdditionalComments());
  }

  private static MedicalHistoryDto toInterfaceType(StiConsultationMedicalHistory entity) {
    return new StiConsultationMedicalHistoryDto(
        entity.getExaminationReason(),
        entity.getCurrentSymptoms(),
        entity.getContactToClarifyDate(),
        RelationshipModelMapper.toInterfaceType(entity.getRelationshipModel()),
        ExaminationMapper.toInterfaceType(entity.getExaminations()),
        PreviousIllnessMapper.toInterfaceType(entity.getPreviousIllnesses()),
        RiskContactMapper.toInterfaceType(entity.getRiskContacts()),
        PreventionMapper.toInterfaceType(entity.getPrevention()),
        RiskFactorMapper.toInterfaceType(entity.getRiskFactors()),
        entity.getAdditionalComments());
  }

  public static MedicalHistory update(MedicalHistoryDto dto, MedicalHistory entity) {
    if (dto instanceof StiConsultationMedicalHistoryDto
        && !(entity instanceof StiConsultationMedicalHistory)) {
      throw new BadRequestException(
          "StiConsultationMedicalHistory can't be updated at procedure %s with concern %s"
              .formatted(
                  entity.getProcedure().getExternalId(), entity.getProcedure().getConcern()));
    } else if (dto instanceof SexWorkMedicalHistoryDto
        && !(entity instanceof SexWorkMedicalHistory)) {
      throw new BadRequestException(
          "SexWorkMedicalHistory can't be created at procedure %s with concern %s"
              .formatted(
                  entity.getProcedure().getExternalId(), entity.getProcedure().getConcern()));
    }

    return switch (dto) {
      case SexWorkMedicalHistoryDto sexWork -> updateSexWorkMedicalHistory(sexWork, entity);
      case StiConsultationMedicalHistoryDto consultation ->
          updateStiConsultationMedicalHistory(consultation, entity);
    };
  }

  private static MedicalHistory updateSexWorkMedicalHistory(
      SexWorkMedicalHistoryDto dto, MedicalHistory entity) {
    SexWorkMedicalHistory sexWorkMedicalHistory = (SexWorkMedicalHistory) entity;
    sexWorkMedicalHistory.setLastMenstruationDate(dto.lastMenstruationDate());
    sexWorkMedicalHistory.setLastCancerScreeningDate(dto.lastCancerScreeningDate());
    sexWorkMedicalHistory.setPreviouslyPregnant(dto.previouslyPregnant());
    sexWorkMedicalHistory.setAmountPregnancies(dto.amountPregnancies());
    sexWorkMedicalHistory.setAmountAbortions(dto.amountAbortions());
    sexWorkMedicalHistory.setKnownOperations(dto.knownOperations());
    sexWorkMedicalHistory.setMedications(dto.medications());
    sexWorkMedicalHistory.setSexWorkRiskContacts(
        SexWorkRiskContactMapper.toDatabaseType(dto.sexWorkRiskContacts()));
    return updateGeneralMedicalHistory(dto, entity);
  }

  private static MedicalHistory updateStiConsultationMedicalHistory(
      StiConsultationMedicalHistoryDto dto, MedicalHistory entity) {
    return updateGeneralMedicalHistory(dto, entity);
  }

  private static MedicalHistory updateGeneralMedicalHistory(
      MedicalHistoryDto dto, MedicalHistory entity) {
    entity.setExaminationReason(dto.examinationReason());
    entity.setCurrentSymptoms(dto.currentSymptoms());
    entity.setContactToClarifyDate(dto.contactToClarifyDate());
    entity.setRelationshipModel(RelationshipModelMapper.toDatabaseType(dto.relationshipModel()));
    entity.setExaminations(ExaminationMapper.toDatabaseType(dto.examinations()));
    entity.setPreviousIllnesses(PreviousIllnessMapper.toDatabaseType(dto.previousIllnesses()));
    entity.setRiskContacts(RiskContactMapper.toDatabaseType(dto.riskContacts()));
    entity.setPrevention(PreventionMapper.toDatabaseType(dto.prevention()));
    entity.setRiskFactors(RiskFactorMapper.toDatabaseType(dto.riskFactors()));
    entity.setAdditionalComments(dto.additionalComments());
    return entity;
  }
}
