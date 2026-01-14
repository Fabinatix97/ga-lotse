/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.mapper;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.base.GenderDto;
import de.eshg.stiprotection.persistence.db.Gender;
import java.util.Collections;
import java.util.Comparator;
import java.util.Set;

public class GenderMapper {

  private GenderMapper() {}

  public static Set<GenderDto> toInterfaceType(Set<Gender> genders) {
    if (genders == null) {
      return Collections.emptySet();
    }
    return genders.stream()
        .map(GenderMapper::toInterfaceType)
        .sorted(Comparator.comparing(GenderDto::name))
        .collect(StreamUtil.toLinkedHashSet());
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

  public static Set<Gender> toDatabaseType(Set<GenderDto> genderDtos) {
    if (genderDtos == null) {
      return Collections.emptySet();
    }
    return genderDtos.stream()
        .map(GenderMapper::toDatabaseType)
        .sorted(Comparator.comparing(Gender::name))
        .collect(StreamUtil.toLinkedHashSet());
  }

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
}
