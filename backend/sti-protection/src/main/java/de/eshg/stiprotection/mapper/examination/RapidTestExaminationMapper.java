/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.mapper.examination;

import de.eshg.stiprotection.api.examination.RapidTestExaminationDto;
import de.eshg.stiprotection.persistence.db.examination.RapidTestExamination;

public class RapidTestExaminationMapper {
  private RapidTestExaminationMapper() {}

  public static RapidTestExaminationDto toInterfaceType(RapidTestExamination entity) {
    if (entity == null) {
      return new RapidTestExaminationDto(
          null, false, false, false, false, false, false, false, false, null, null, null, null,
          null, null, null);
    }

    return new RapidTestExaminationDto(
        entity.getGeneralComments(),
        entity.getTestsPayed(),
        entity.isHivRequested(),
        entity.isSyphilisRequested(),
        entity.isPregnancyTestRequested(),
        entity.isUltrasoundRequested(),
        entity.isBloodPressureRequested(),
        entity.isPulseRequested(),
        entity.isUrinalysisRequested(),
        RapidTestDataMapper.toInterfaceType(entity.getHivData()),
        RapidTestDataMapper.toInterfaceType(entity.getSyphilisData()),
        RapidTestDataMapper.toInterfaceType(entity.getPregnancyTestData()),
        entity.getUltrasoundData(),
        entity.getBloodPressureData(),
        entity.getPulseData(),
        entity.getUrinalysisData());
  }

  public static RapidTestExamination update(
      RapidTestExaminationDto dto, RapidTestExamination entity) {
    if (dto == null) {
      return null;
    }

    entity.setGeneralComments(dto.generalComments());
    entity.setTestsPayed(dto.testsPayed());
    entity.setHivData(RapidTestDataMapper.toDatabaseType(dto.hivData()));
    entity.setSyphilisData(RapidTestDataMapper.toDatabaseType(dto.syphilisData()));
    entity.setPregnancyTestData(RapidTestDataMapper.toDatabaseType(dto.pregnancyTestData()));
    entity.setUltrasoundData(dto.ultrasoundData());
    entity.setBloodPressureData(dto.bloodPressureData());
    entity.setPulseData(dto.pulseData());
    entity.setUrinalysisData(dto.urinalysisData());
    entity.setHivRequested(dto.hivRequested());
    entity.setSyphilisRequested(dto.syphilisRequested());
    entity.setPregnancyTestRequested(dto.pregnancyTestRequested());
    entity.setUltrasoundRequested(dto.ultrasoundRequested());
    entity.setBloodPressureRequested(dto.bloodPressureRequested());
    entity.setPulseRequested(dto.pulseRequested());
    entity.setUrinalysisRequested(dto.urinalysisRequested());
    return entity;
  }
}
