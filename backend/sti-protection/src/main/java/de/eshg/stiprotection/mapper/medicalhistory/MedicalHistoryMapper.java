/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.mapper.medicalhistory;

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
        entity.getContactToClarifyDuration(),
        RelationshipModelMapper.toInterfaceType(entity.getRelationshipModel()),
        entity.getLastMenstruationDuration(),
        entity.getLastCancerScreeningDuration(),
        entity.getAmountPregnancies(),
        entity.getAmountAbortions(),
        entity.getKnownOperations(),
        entity.getMedications(),
        ExaminationMapper.toInterfaceType(entity.getExaminations()),
        PreviousIllnessMapper.toInterfaceType(entity.getPreviousIllnesses()),
        RiskContactMapper.toInterfaceType(entity.getRiskContacts()),
        RiskFactorMapper.toInterfaceType(entity.getRiskFactors()),
        entity.getAdditionalComments());
  }

  private static MedicalHistoryDto toInterfaceType(StiConsultationMedicalHistory entity) {
    return new StiConsultationMedicalHistoryDto(
        entity.getExaminationReason(),
        entity.getCurrentSymptoms(),
        entity.getContactToClarifyDuration(),
        RelationshipModelMapper.toInterfaceType(entity.getRelationshipModel()),
        ExaminationMapper.toInterfaceType(entity.getExaminations()),
        PreviousIllnessMapper.toInterfaceType(entity.getPreviousIllnesses()),
        RiskContactMapper.toInterfaceType(entity.getRiskContacts()),
        RiskFactorMapper.toInterfaceType(entity.getRiskFactors()),
        entity.getAdditionalComments());
  }

  public static MedicalHistory toDatabaseType(MedicalHistoryDto dto) {
    return switch (dto) {
      case SexWorkMedicalHistoryDto sexWork -> toDatabaseType(sexWork);
      case StiConsultationMedicalHistoryDto consultation -> toDatabaseType(consultation);
    };
  }

  private static MedicalHistory toDatabaseType(SexWorkMedicalHistoryDto dto) {
    SexWorkMedicalHistory sexWorkMedicalHistory = new SexWorkMedicalHistory();
    sexWorkMedicalHistory.setLastMenstruationDuration(dto.lastMenstruationDuration());
    sexWorkMedicalHistory.setLastCancerScreeningDuration(dto.lastCancerScreeningDuration());
    sexWorkMedicalHistory.setAmountPregnancies(dto.amountPregnancies());
    sexWorkMedicalHistory.setAmountAbortions(dto.amountAbortions());
    sexWorkMedicalHistory.setKnownOperations(dto.knownOperations());
    sexWorkMedicalHistory.setMedications(dto.medications());
    return updateMedicalHistory(dto, sexWorkMedicalHistory);
  }

  private static MedicalHistory toDatabaseType(StiConsultationMedicalHistoryDto dto) {
    return updateMedicalHistory(dto, new StiConsultationMedicalHistory());
  }

  private static MedicalHistory updateMedicalHistory(MedicalHistoryDto dto, MedicalHistory entity) {
    entity.setExaminationReason(dto.examinationReason());
    entity.setCurrentSymptoms(dto.currentSymptoms());
    entity.setContactToClarifyDuration(dto.contactToClarifyDuration());
    entity.setRelationshipModel(RelationshipModelMapper.toDatabaseType(dto.relationshipModel()));
    entity.setExaminations(ExaminationMapper.toDatabaseType(dto.examinations()));
    entity.setPreviousIllnesses(PreviousIllnessMapper.toDatabaseType(dto.previousIllnesses()));
    entity.setRiskContacts(RiskContactMapper.toDatabaseType(dto.riskContacts()));
    entity.setRiskFactors(RiskFactorMapper.toDatabaseType(dto.riskFactors()));
    entity.setAdditionalComments(dto.additionalComments());

    return entity;
  }
}
