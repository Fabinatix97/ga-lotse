/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.mapper.diagnosis;

import de.eshg.stiprotection.api.diagnosis.MedicationDto;
import de.eshg.stiprotection.persistence.db.diagnosis.Medication;
import java.util.List;
import org.springframework.util.CollectionUtils;

public class MedicationMapper {

  private MedicationMapper() {}

  public static MedicationDto toInterfaceType(Medication entity) {
    if (entity == null) {
      return null;
    }
    return new MedicationDto(entity.name(), entity.dose(), entity.prescriptionDate());
  }

  public static List<MedicationDto> toInterfaceType(List<Medication> entities) {
    if (CollectionUtils.isEmpty(entities)) {
      return List.of();
    }
    return entities.stream().map(MedicationMapper::toInterfaceType).toList();
  }

  public static Medication toDatabaseType(MedicationDto dto) {
    if (dto == null) {
      return null;
    }
    return new Medication(dto.name(), dto.dose(), dto.prescriptionDate());
  }

  public static List<Medication> toDatabaseType(List<MedicationDto> dto) {
    if (CollectionUtils.isEmpty(dto)) {
      return List.of();
    }
    return dto.stream().map(MedicationMapper::toDatabaseType).toList();
  }
}
