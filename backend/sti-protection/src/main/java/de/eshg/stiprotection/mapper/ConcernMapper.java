/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.mapper;

import de.eshg.stiprotection.api.ConcernDto;
import de.eshg.stiprotection.persistence.db.Concern;

public class ConcernMapper {

  private ConcernMapper() {}

  public static ConcernDto toInterfaceType(Concern concern) {
    if (concern == null) {
      return null;
    }

    return switch (concern) {
      case HIV_STI_CONSULTATION -> ConcernDto.HIV_STI_CONSULTATION;
      case SEX_WORK -> ConcernDto.SEX_WORK;
    };
  }

  public static Concern toDatabaseType(ConcernDto concernDto) {
    if (concernDto == null) {
      return null;
    }

    return switch (concernDto) {
      case HIV_STI_CONSULTATION -> Concern.HIV_STI_CONSULTATION;
      case SEX_WORK -> Concern.SEX_WORK;
    };
  }
}
