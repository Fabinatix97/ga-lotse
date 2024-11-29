/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.mapper.medicalhistory;

import de.eshg.stiprotection.api.medicalhistory.SexWorkLocationDto;
import de.eshg.stiprotection.persistence.db.medicalhistory.SexWorkLocation;
import java.util.Collections;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.stream.Collectors;

public class SexWorkLocationMapper {

  private SexWorkLocationMapper() {}

  public static Set<SexWorkLocationDto> toInterfaceType(Set<SexWorkLocation> entities) {
    if (entities == null) {
      return Collections.emptySet();
    }
    return entities.stream()
        .map(SexWorkLocationMapper::toInterfaceType)
        .sorted(Comparator.comparing(SexWorkLocationDto::name))
        .collect(Collectors.toCollection(LinkedHashSet::new));
  }

  public static SexWorkLocationDto toInterfaceType(SexWorkLocation entity) {
    if (entity == null) {
      return null;
    }

    return switch (entity) {
      case BORDELLO -> SexWorkLocationDto.BORDELLO;
      case CLUB -> SexWorkLocationDto.CLUB;
      case ESCORT -> SexWorkLocationDto.ESCORT;
      case APARTMENT -> SexWorkLocationDto.APARTMENT;
      case APPOINTMENT_APARTMENT -> SexWorkLocationDto.APPOINTMENT_APARTMENT;
      case MASSAGE_PARLOR -> SexWorkLocationDto.MASSAGE_PARLOR;
      case TANTRA_PRACTICE -> SexWorkLocationDto.TANTRA_PRACTICE;
      case STREET_PROSTITUTION -> SexWorkLocationDto.STREET_PROSTITUTION;
      case OTHER -> SexWorkLocationDto.OTHER;
    };
  }

  public static Set<SexWorkLocation> toDatabaseType(Set<SexWorkLocationDto> dtos) {
    if (dtos == null) {
      return Collections.emptySet();
    }
    return dtos.stream()
        .map(SexWorkLocationMapper::toDatabaseType)
        .sorted(Comparator.comparing(SexWorkLocation::name))
        .collect(Collectors.toCollection(LinkedHashSet::new));
  }

  public static SexWorkLocation toDatabaseType(SexWorkLocationDto dto) {
    if (dto == null) {
      return null;
    }

    return switch (dto) {
      case BORDELLO -> SexWorkLocation.BORDELLO;
      case CLUB -> SexWorkLocation.CLUB;
      case ESCORT -> SexWorkLocation.ESCORT;
      case APARTMENT -> SexWorkLocation.APARTMENT;
      case APPOINTMENT_APARTMENT -> SexWorkLocation.APPOINTMENT_APARTMENT;
      case MASSAGE_PARLOR -> SexWorkLocation.MASSAGE_PARLOR;
      case TANTRA_PRACTICE -> SexWorkLocation.TANTRA_PRACTICE;
      case STREET_PROSTITUTION -> SexWorkLocation.STREET_PROSTITUTION;
      case OTHER -> SexWorkLocation.OTHER;
    };
  }
}
