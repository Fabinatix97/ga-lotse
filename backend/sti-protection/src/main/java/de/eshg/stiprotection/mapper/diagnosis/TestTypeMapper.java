/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.mapper.diagnosis;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.stiprotection.api.diagnosis.TestTypeDto;
import de.eshg.stiprotection.persistence.db.diagnosis.TestType;
import java.util.Comparator;
import java.util.Set;

public class TestTypeMapper {
  private TestTypeMapper() {}

  public static Set<TestTypeDto> toInterfaceType(Set<TestType> entities) {
    if (entities == null) {
      return Set.of();
    }
    return entities.stream()
        .map(TestTypeMapper::toInterface)
        .sorted(Comparator.comparing(TestTypeDto::name))
        .collect(StreamUtil.toLinkedHashSet());
  }

  private static TestTypeDto toInterface(TestType entity) {
    return switch (entity) {
      case null -> null;
      case WESTERN_BLOT -> TestTypeDto.WESTERN_BLOT;
      case P24 -> TestTypeDto.P24;
      case PCR -> TestTypeDto.PCR;
      case OTHER -> TestTypeDto.OTHER;
    };
  }

  public static Set<TestType> toDatabaseType(Set<TestTypeDto> dtos) {
    if (dtos == null) {
      return Set.of();
    }
    return dtos.stream()
        .map(TestTypeMapper::toDatabaseType)
        .sorted(Comparator.comparing(TestType::name))
        .collect(StreamUtil.toLinkedHashSet());
  }

  private static TestType toDatabaseType(TestTypeDto dto) {
    return switch (dto) {
      case null -> null;
      case WESTERN_BLOT -> TestType.WESTERN_BLOT;
      case P24 -> TestType.P24;
      case PCR -> TestType.PCR;
      case OTHER -> TestType.OTHER;
    };
  }
}
