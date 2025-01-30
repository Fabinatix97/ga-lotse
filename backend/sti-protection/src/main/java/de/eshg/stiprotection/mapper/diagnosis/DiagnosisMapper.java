/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.mapper.diagnosis;

import de.eshg.base.icd10.api.Icd10CodeDto;
import de.eshg.stiprotection.api.diagnosis.DiagnosisDto;
import de.eshg.stiprotection.persistence.db.diagnosis.Diagnosis;
import java.util.List;
import org.springframework.util.CollectionUtils;

public class DiagnosisMapper {

  private DiagnosisMapper() {}

  public static DiagnosisDto toInterfaceType(Diagnosis entity, List<Icd10CodeDto> icd10Codes) {
    if (entity == null) {
      return new DiagnosisDto(null, null, null, null, null, null, false);
    }

    return new DiagnosisDto(
        entity.getResults(),
        MedicationMapper.toInterfaceType(entity.getMedications()),
        icd10Codes,
        TestTypeMapper.toInterfaceType(entity.getTestTypes()),
        entity.getOtherTestTypeName(),
        entity.getGeneralRemarks(),
        entity.getResultsCommunicated());
  }

  public static DiagnosisDto toInterfaceType(Diagnosis entity) {
    if (entity == null) {
      return new DiagnosisDto(null, null, null, null, null, null, false);
    }

    return new DiagnosisDto(
        entity.getResults(),
        MedicationMapper.toInterfaceType(entity.getMedications()),
        null,
        TestTypeMapper.toInterfaceType(entity.getTestTypes()),
        entity.getOtherTestTypeName(),
        entity.getGeneralRemarks(),
        entity.getResultsCommunicated());
  }

  public static Diagnosis toDatabaseType(DiagnosisDto dto) {
    if (dto == null) {
      return null;
    }

    Diagnosis diagnosis = new Diagnosis();
    diagnosis.setResults(dto.results());
    diagnosis.setMedications(MedicationMapper.toDatabaseType(dto.medications()));
    diagnosis.setIcd10Codes(toIcd10Codes(dto.findings()));
    diagnosis.setTestTypes(TestTypeMapper.toDatabaseType(dto.testTypes()));
    diagnosis.setOtherTestTypeName(dto.otherTestTypeName());
    diagnosis.setGeneralRemarks(dto.generalRemarks());
    diagnosis.setResultsCommunicated(dto.resultsCommunicated());

    return diagnosis;
  }

  private static List<String> toIcd10Codes(List<Icd10CodeDto> icd10CodeDtos) {
    if (CollectionUtils.isEmpty(icd10CodeDtos)) {
      return List.of();
    }
    return icd10CodeDtos.stream().map(Icd10CodeDto::code).toList();
  }
}
