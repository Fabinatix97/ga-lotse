/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.mapper.medicalhistory;

import de.eshg.stiprotection.api.medicalhistory.VaccinationDto;
import de.eshg.stiprotection.persistence.db.medicalhistory.Vaccination;
import java.util.Collections;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.stream.Collectors;

public class VaccinationMapper {

  private VaccinationMapper() {}

  public static Set<VaccinationDto> toInterfaceType(Set<Vaccination> entities) {
    if (entities == null) {
      return Collections.emptySet();
    }
    return entities.stream()
        .map(VaccinationMapper::toInterfaceType)
        .sorted(Comparator.comparing(VaccinationDto::name))
        .collect(Collectors.toCollection(LinkedHashSet::new));
  }

  public static VaccinationDto toInterfaceType(Vaccination entity) {
    if (entity == null) {
      return null;
    }

    return switch (entity) {
      case HEPATITIS_A -> VaccinationDto.HEPATITIS_A;
      case HEPATITIS_B -> VaccinationDto.HEPATITIS_B;
      case HPV -> VaccinationDto.HPV;
    };
  }

  public static Set<Vaccination> toDatabaseType(Set<VaccinationDto> dtos) {
    if (dtos == null) {
      return Collections.emptySet();
    }
    return dtos.stream()
        .map(VaccinationMapper::toDatabaseType)
        .sorted(Comparator.comparing(Vaccination::name))
        .collect(Collectors.toCollection(LinkedHashSet::new));
  }

  public static Vaccination toDatabaseType(VaccinationDto dto) {
    if (dto == null) {
      return null;
    }

    return switch (dto) {
      case HEPATITIS_A -> Vaccination.HEPATITIS_A;
      case HEPATITIS_B -> Vaccination.HEPATITIS_B;
      case HPV -> Vaccination.HPV;
    };
  }
}
