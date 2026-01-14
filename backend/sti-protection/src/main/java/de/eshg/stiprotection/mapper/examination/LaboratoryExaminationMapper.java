/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.mapper.examination;

import de.eshg.stiprotection.api.examination.LaboratoryTestExaminationDto;
import de.eshg.stiprotection.persistence.db.examination.LaboratoryTestExamination;
import java.util.Objects;

public class LaboratoryExaminationMapper {

  private LaboratoryExaminationMapper() {}

  public static LaboratoryTestExaminationDto toInterfaceType(LaboratoryTestExamination entity) {
    if (entity == null) {
      return defaultLaboratoryExaminationDto();
    }

    return new LaboratoryTestExaminationDto(
        entity.getSampleBarCode(),
        entity.getGeneralRemarks(),
        Objects.nonNull(entity.getTestsConductedDate()) ? true : null,
        entity.getTestsPayed(),
        LaboratoryTestDataMapper.toInterfaceType(entity.getLabTests()));
  }

  private static LaboratoryTestExaminationDto defaultLaboratoryExaminationDto() {
    return new LaboratoryTestExaminationDto(null, null, null, null, null);
  }

  public static LaboratoryTestExamination update(
      LaboratoryTestExaminationDto dto, LaboratoryTestExamination entity) {
    if (dto == null) {
      return null;
    }

    entity.setSampleBarCode(dto.sampleBarcode());
    entity.setGeneralRemarks(dto.generalRemarks());
    entity.setTestsPayed(dto.testsPayed());
    entity.setLabTests(LaboratoryTestDataMapper.toDatabaseTypeLabTestData(dto.labTestData()));
    return entity;
  }
}
