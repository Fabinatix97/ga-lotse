/*
 * Copyright 2025 cronn GmbH
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
        entity.getHivRequested(),
        entity.getSyphilisRequested(),
        entity.getHepARequested(),
        entity.getHepBRequested(),
        entity.getHepCRequested(),
        entity.getChlamydiaRequested(),
        entity.getGonorrheaRequested(),
        entity.getMycoplasmaRequested(),
        entity.getCancerScreeningRequested(),
        entity.getHpvRequested(),
        entity.getMpoxRequested(),
        entity.getOtherTestRequested(),
        LaboratoryTestDataMapper.toInterfaceType(entity.getHivData()),
        LaboratoryTestDataMapper.toInterfaceType(entity.getSyphilisData()),
        entity.getHadSyphilis(),
        LaboratoryTestDataMapper.toInterfaceType(entity.getHepAData()),
        LaboratoryTestDataMapper.toInterfaceType(entity.getHepBData()),
        LaboratoryTestDataMapper.toInterfaceType(entity.getHepCData()),
        LaboratoryTestDataMapper.toInterfaceType(entity.getChlamydiaTestSamples()),
        LaboratoryTestDataMapper.toInterfaceType(entity.getGonorrheaTestSamples()),
        LaboratoryTestDataMapper.toInterfaceType(entity.getMycoplasmaTestSamples()),
        LaboratoryTestDataMapper.toInterfaceType(entity.getCancerScreeningData()),
        LaboratoryTestDataMapper.toInterfaceType(entity.getHpvData()),
        LaboratoryTestDataMapper.toInterfaceType(entity.getMpoxData()),
        entity.getOtherTestName(),
        LaboratoryTestDataMapper.toInterfaceType(entity.getOtherTestData()));
  }

  private static LaboratoryTestExaminationDto defaultLaboratoryExaminationDto() {
    return new LaboratoryTestExaminationDto(
        null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
  }

  public static LaboratoryTestExamination update(
      LaboratoryTestExaminationDto dto, LaboratoryTestExamination entity) {
    if (dto == null) {
      return null;
    }

    entity.setSampleBarCode(dto.sampleBarcode());
    entity.setGeneralRemarks(dto.generalRemarks());
    entity.setTestsPayed(dto.testsPayed());
    entity.setHivRequested(dto.hivTestRequested());
    entity.setSyphilisRequested(dto.syphilisTestRequested());
    entity.setHepARequested(dto.hepATestRequested());
    entity.setHepBRequested(dto.hepBTestRequested());
    entity.setHepCRequested(dto.hepCTestRequested());
    entity.setChlamydiaRequested(dto.chlamydiaTestRequested());
    entity.setGonorrheaRequested(dto.gonorrheaTestRequested());
    entity.setMycoplasmaRequested(dto.mycoplasmaTestRequested());
    entity.setCancerScreeningRequested(dto.cancerScreeningTestRequested());
    entity.setHpvRequested(dto.hpvTestRequested());
    entity.setMpoxRequested(dto.mpoxTestRequested());
    entity.setOtherTestRequested(dto.otherTestRequested());
    entity.setHivData(LaboratoryTestDataMapper.toDatabaseType(dto.hivTestData()));
    entity.setSyphilisData(LaboratoryTestDataMapper.toDatabaseType(dto.syphilisTestData()));
    entity.setHadSyphilis(dto.hadSyphilis());
    entity.setHepAData(LaboratoryTestDataMapper.toDatabaseType(dto.hepATestData()));
    entity.setHepBData(LaboratoryTestDataMapper.toDatabaseType(dto.hepBTestData()));
    entity.setHepCData(LaboratoryTestDataMapper.toDatabaseType(dto.hepCTestData()));
    entity.setChlamydiaTestSamples(
        LaboratoryTestDataMapper.toDatabaseType(dto.chlamydiaTestSamples()));
    entity.setGonorrheaTestSamples(
        LaboratoryTestDataMapper.toDatabaseType(dto.gonorrheaTestSamples()));
    entity.setMycoplasmaTestSamples(
        LaboratoryTestDataMapper.toDatabaseType(dto.mycoplasmaTestSamples()));
    entity.setCancerScreeningData(
        LaboratoryTestDataMapper.toDatabaseType(dto.cancerScreeningTestData()));
    entity.setHpvData(LaboratoryTestDataMapper.toDatabaseType(dto.hpvTestData()));
    entity.setMpoxData(LaboratoryTestDataMapper.toDatabaseType(dto.mpoxTestData()));
    entity.setOtherTestName(dto.otherTestName());
    entity.setOtherTestData(LaboratoryTestDataMapper.toDatabaseType(dto.otherTestData()));
    return entity;
  }
}
