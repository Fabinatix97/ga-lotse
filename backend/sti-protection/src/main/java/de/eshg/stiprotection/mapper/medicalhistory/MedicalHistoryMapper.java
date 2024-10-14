/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.mapper.medicalhistory;

import de.eshg.stiprotection.api.medicalhistory.MedicalHistoryDto;
import de.eshg.stiprotection.api.medicalhistory.SexWorkMedicalHistoryDto;
import de.eshg.stiprotection.api.medicalhistory.StiConsultationMedicalHistoryDto;
import de.eshg.stiprotection.mapper.GenderMapper;
import de.eshg.stiprotection.persistence.db.medicalhistory.MedicalHistory;
import de.eshg.stiprotection.persistence.db.medicalhistory.SexWorkMedicalHistory;
import de.eshg.stiprotection.persistence.db.medicalhistory.StiConsultationMedicalHistory;

public final class MedicalHistoryMapper {
  private MedicalHistoryMapper() {}

  public static MedicalHistory toDatabaseType(MedicalHistoryDto dto) {
    return switch (dto) {
      case SexWorkMedicalHistoryDto sexWork -> toDatabaseType(sexWork);
      case StiConsultationMedicalHistoryDto consultation -> toDatabaseType(consultation);
    };
  }

  private static MedicalHistory toDatabaseType(SexWorkMedicalHistoryDto dto) {
    return updateMedicalHistory(dto, new SexWorkMedicalHistory());
  }

  private static MedicalHistory toDatabaseType(StiConsultationMedicalHistoryDto dto) {
    return updateMedicalHistory(dto, new StiConsultationMedicalHistory());
  }

  private static MedicalHistory updateMedicalHistory(
      MedicalHistoryDto dto, MedicalHistory medicalHistory) {
    medicalHistory.setExaminationReason(dto.examinationReason());
    medicalHistory.setSexualContact(GenderMapper.toDatabaseType(dto.sexualContact()));
    medicalHistory.setSexualOrientation(
        SexualOrientationMapper.toDatabaseType(dto.sexualOrientation()));
    medicalHistory.clearExaminations();
    if (dto.examinations() != null) {
      dto.examinations()
          .forEach(e -> medicalHistory.addExamination(ExaminationMapper.toDatabaseType(e)));
    }
    medicalHistory.clearVaccinations();
    if (dto.vaccinations() != null) {
      dto.vaccinations()
          .forEach(v -> medicalHistory.addVaccination(VaccinationMapper.toDatabaseType(v)));
    }
    return medicalHistory;
  }

  public static MedicalHistoryDto toInterfaceType(MedicalHistory entity) {
    return switch (entity) {
      case StiConsultationMedicalHistory consultation -> toInterfaceType(consultation);
      case SexWorkMedicalHistory sexWork -> toInterfaceType(sexWork);
      default -> throw new IllegalArgumentException("Unexpected value: " + entity.getClass());
    };
  }

  private static MedicalHistoryDto toInterfaceType(SexWorkMedicalHistory medicalHistory) {
    return new SexWorkMedicalHistoryDto(
        medicalHistory.getExaminationReason(),
        SexualOrientationMapper.toInterfaceType(medicalHistory.getSexualOrientation()),
        GenderMapper.toInterfaceType(medicalHistory.getSexualContact()),
        ExaminationMapper.toInterfaceType(medicalHistory.getExaminations()),
        VaccinationMapper.toInterfaceType(medicalHistory.getVaccinations()));
  }

  private static MedicalHistoryDto toInterfaceType(StiConsultationMedicalHistory medicalHistory) {
    return new StiConsultationMedicalHistoryDto(
        medicalHistory.getExaminationReason(),
        SexualOrientationMapper.toInterfaceType(medicalHistory.getSexualOrientation()),
        GenderMapper.toInterfaceType(medicalHistory.getSexualContact()),
        ExaminationMapper.toInterfaceType(medicalHistory.getExaminations()),
        VaccinationMapper.toInterfaceType(medicalHistory.getVaccinations()));
  }
}
