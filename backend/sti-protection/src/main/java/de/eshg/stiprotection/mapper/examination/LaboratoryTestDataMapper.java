/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.mapper.examination;

import de.eshg.stiprotection.api.examination.HepatitisLaboratoryTestDto;
import de.eshg.stiprotection.api.examination.LaboratoryTestDto;
import de.eshg.stiprotection.api.examination.LaboratoryTestSamplesDto;
import de.eshg.stiprotection.persistence.db.examination.HepatitisLaboratoryTestData;
import de.eshg.stiprotection.persistence.db.examination.LaboratoryTestData;
import de.eshg.stiprotection.persistence.db.examination.LaboratoryTestSamplesData;

public class LaboratoryTestDataMapper {

  private LaboratoryTestDataMapper() {}

  public static LaboratoryTestDto toInterfaceType(LaboratoryTestData entity) {
    if (entity == null) {
      return null;
    }

    return new LaboratoryTestDto(entity.getResult(), entity.getValue(), entity.getRemark());
  }

  public static LaboratoryTestData toDatabaseType(LaboratoryTestDto dto) {
    if (dto == null) {
      return null;
    }

    LaboratoryTestData laboratoryTestData = new LaboratoryTestData();
    laboratoryTestData.setResult(dto.result());
    laboratoryTestData.setValue(dto.value());
    laboratoryTestData.setRemark(dto.remark());
    return laboratoryTestData;
  }

  public static LaboratoryTestSamplesDto toInterfaceType(LaboratoryTestSamplesData entity) {
    if (entity == null) {
      return null;
    }

    return new LaboratoryTestSamplesDto(
        entity.getOralSampleRequested(),
        LaboratoryTestDataMapper.toInterfaceType(entity.getOralSampleData()),
        entity.getUrethralSampleRequested(),
        LaboratoryTestDataMapper.toInterfaceType(entity.getUrethralSampleData()),
        entity.getAnalSampleRequested(),
        LaboratoryTestDataMapper.toInterfaceType(entity.getAnalSampleData()));
  }

  public static LaboratoryTestSamplesData toDatabaseType(LaboratoryTestSamplesDto dto) {
    if (dto == null) {
      return null;
    }

    LaboratoryTestSamplesData laboratoryTestSamplesData = new LaboratoryTestSamplesData();
    laboratoryTestSamplesData.setOralSampleRequested(dto.oralSampleRequested());
    laboratoryTestSamplesData.setOralSampleData(
        LaboratoryTestDataMapper.toDatabaseType(dto.oralSampleData()));
    laboratoryTestSamplesData.setUrethralSampleRequested(dto.urethralSampleRequested());
    laboratoryTestSamplesData.setUrethralSampleData(
        LaboratoryTestDataMapper.toDatabaseType(dto.urethralSampleData()));
    laboratoryTestSamplesData.setAnalSampleRequested(dto.analSampleRequested());
    laboratoryTestSamplesData.setAnalSampleData(
        LaboratoryTestDataMapper.toDatabaseType(dto.analSampleData()));
    return laboratoryTestSamplesData;
  }

  public static HepatitisLaboratoryTestDto toInterfaceType(HepatitisLaboratoryTestData entity) {
    if (entity == null) {
      return null;
    }

    return new HepatitisLaboratoryTestDto(
        entity.getResult(),
        entity.getInfection(),
        entity.getVaccineTitre(),
        entity.getValue(),
        entity.getRemark());
  }

  public static HepatitisLaboratoryTestData toDatabaseType(HepatitisLaboratoryTestDto dto) {
    if (dto == null) {
      return null;
    }

    HepatitisLaboratoryTestData entity = new HepatitisLaboratoryTestData();
    entity.setResult(dto.result());
    entity.setInfection(dto.infection());
    entity.setVaccineTitre(dto.vaccineTitre());
    entity.setValue(dto.value());
    entity.setRemark(dto.remark());
    return entity;
  }
}
