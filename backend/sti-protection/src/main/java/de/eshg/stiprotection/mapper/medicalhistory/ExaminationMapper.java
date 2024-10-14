/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.mapper.medicalhistory;

import de.eshg.stiprotection.api.medicalhistory.ExaminationDto;
import de.eshg.stiprotection.persistence.db.medicalhistory.Examination;
import java.util.List;

public final class ExaminationMapper {
  private ExaminationMapper() {}

  public static List<ExaminationDto> toInterfaceType(List<Examination> examinations) {
    if (examinations == null) {
      return null;
    }
    return examinations.stream().map(ExaminationMapper::toInterfaceType).toList();
  }

  private static ExaminationDto toInterfaceType(Examination entity) {
    return new ExaminationDto(
        DiseaseTypeMapper.toInterfaceType(entity.getDiseaseType()), entity.getExaminationDate());
  }

  public static Examination toDatabaseType(ExaminationDto dto) {
    Examination examination = new Examination();
    examination.setDiseaseType(DiseaseTypeMapper.toDatabaseType(dto.diseaseType()));
    examination.setExaminationDate(dto.examinationDate());
    return examination;
  }
}
