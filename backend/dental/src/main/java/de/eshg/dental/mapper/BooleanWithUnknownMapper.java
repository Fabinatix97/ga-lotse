/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.dental.mapper;

import de.eshg.dental.api.BooleanWithUnknownDto;
import de.eshg.dental.domain.model.BooleanWithUnknown;

public class BooleanWithUnknownMapper {
  private BooleanWithUnknownMapper() {}

  public static BooleanWithUnknownDto mapToDto(BooleanWithUnknown value) {
    return switch (value) {
      case null -> null;
      case TRUE -> BooleanWithUnknownDto.TRUE;
      case FALSE -> BooleanWithUnknownDto.FALSE;
      case UNKNOWN -> BooleanWithUnknownDto.UNKNOWN;
    };
  }

  public static BooleanWithUnknown mapToDomain(BooleanWithUnknownDto dto) {
    return switch (dto) {
      case null -> null;
      case TRUE -> BooleanWithUnknown.TRUE;
      case FALSE -> BooleanWithUnknown.FALSE;
      case UNKNOWN -> BooleanWithUnknown.UNKNOWN;
    };
  }

  public static BooleanWithUnknownDto mapToBooleanWithUnknownDto(boolean value) {
    return value ? BooleanWithUnknownDto.TRUE : BooleanWithUnknownDto.FALSE;
  }

  public static BooleanWithUnknown mapToBooleanWithUnknown(boolean value) {
    return value ? BooleanWithUnknown.TRUE : BooleanWithUnknown.FALSE;
  }
}
