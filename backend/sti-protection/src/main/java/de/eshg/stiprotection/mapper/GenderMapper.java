/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.mapper;

import de.eshg.base.GenderDto;
import de.eshg.stiprotection.persistence.db.Gender;

public class GenderMapper {

  private GenderMapper() {}

  public static Gender toDatabaseType(GenderDto gender) {
    if (gender == null) {
      return null;
    }

    return switch (gender) {
      case NOT_SPECIFIED -> Gender.NOT_SPECIFIED;
      case DIVERSE -> Gender.DIVERSE;
      case FEMALE -> Gender.FEMALE;
      case MALE -> Gender.MALE;
    };
  }

  public static GenderDto toInterfaceType(Gender gender) {
    if (gender == null) {
      return null;
    }

    return switch (gender) {
      case NOT_SPECIFIED -> GenderDto.NOT_SPECIFIED;
      case DIVERSE -> GenderDto.DIVERSE;
      case FEMALE -> GenderDto.FEMALE;
      case MALE -> GenderDto.MALE;
    };
  }
}
