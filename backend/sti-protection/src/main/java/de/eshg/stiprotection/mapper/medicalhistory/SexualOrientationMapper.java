/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.mapper.medicalhistory;

import de.eshg.stiprotection.api.medicalhistory.SexualOrientationDto;
import de.eshg.stiprotection.persistence.db.medicalhistory.SexualOrientation;

public final class SexualOrientationMapper {

  private SexualOrientationMapper() {}

  public static SexualOrientationDto toInterfaceType(SexualOrientation entity) {
    return switch (entity) {
      case HETEROSEXUAL -> SexualOrientationDto.HETEROSEXUAL;
      case HOMOSEXUAL -> SexualOrientationDto.HOMOSEXUAL;
      case BISEXUAL -> SexualOrientationDto.BISEXUAL;
      case NOT_SPECIFIED -> SexualOrientationDto.NOT_SPECIFIED;
      case null -> null;
    };
  }

  public static SexualOrientation toDatabaseType(SexualOrientationDto dto) {
    return switch (dto) {
      case HETEROSEXUAL -> SexualOrientation.HETEROSEXUAL;
      case HOMOSEXUAL -> SexualOrientation.HOMOSEXUAL;
      case BISEXUAL -> SexualOrientation.BISEXUAL;
      case NOT_SPECIFIED -> SexualOrientation.NOT_SPECIFIED;
      case null -> null;
    };
  }
}
