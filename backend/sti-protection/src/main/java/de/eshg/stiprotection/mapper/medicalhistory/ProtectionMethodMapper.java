/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.mapper.medicalhistory;

import de.eshg.stiprotection.api.medicalhistory.ProtectionMethodDto;
import de.eshg.stiprotection.persistence.db.medicalhistory.ProtectionMethod;
import java.util.Collections;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.stream.Collectors;

public class ProtectionMethodMapper {

  private ProtectionMethodMapper() {}

  public static Set<ProtectionMethodDto> toInterfaceType(Set<ProtectionMethod> entities) {
    if (entities == null) {
      return Collections.emptySet();
    }
    return entities.stream()
        .map(ProtectionMethodMapper::toInterfaceType)
        .sorted(Comparator.comparing(ProtectionMethodDto::name))
        .collect(Collectors.toCollection(LinkedHashSet::new));
  }

  public static ProtectionMethodDto toInterfaceType(ProtectionMethod entity) {
    if (entity == null) {
      return null;
    }

    return switch (entity) {
      case CONDOM -> ProtectionMethodDto.CONDOM;
      case DENTAL_DAM -> ProtectionMethodDto.DENTAL_DAM;
      case GLOVES -> ProtectionMethodDto.GLOVES;
      case PREP -> ProtectionMethodDto.PREP;
      case THERAPIE -> ProtectionMethodDto.TASP;
      case OTHER -> ProtectionMethodDto.OTHER;
    };
  }

  public static Set<ProtectionMethod> toDatabaseType(Set<ProtectionMethodDto> dtos) {
    if (dtos == null) {
      return Collections.emptySet();
    }
    return dtos.stream()
        .map(ProtectionMethodMapper::toDatabaseType)
        .sorted(Comparator.comparing(ProtectionMethod::name))
        .collect(Collectors.toCollection(LinkedHashSet::new));
  }

  public static ProtectionMethod toDatabaseType(ProtectionMethodDto dto) {
    if (dto == null) {
      return null;
    }

    return switch (dto) {
      case CONDOM -> ProtectionMethod.CONDOM;
      case DENTAL_DAM -> ProtectionMethod.DENTAL_DAM;
      case GLOVES -> ProtectionMethod.GLOVES;
      case PREP -> ProtectionMethod.PREP;
      case TASP -> ProtectionMethod.THERAPIE;
      case OTHER -> ProtectionMethod.OTHER;
    };
  }
}
