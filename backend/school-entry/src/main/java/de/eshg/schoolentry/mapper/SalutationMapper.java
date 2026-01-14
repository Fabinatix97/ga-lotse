/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.mapper;

import de.eshg.base.SalutationDto;
import de.eshg.schoolentry.api.SchoolEntrySalutationDto;

public class SalutationMapper {
  private SalutationMapper() {}

  public static SchoolEntrySalutationDto mapToSchoolEntrySalutationDto(SalutationDto salutation) {
    return switch (salutation) {
      case null -> null;
      case NOT_SPECIFIED -> SchoolEntrySalutationDto.NOT_SPECIFIED;
      case NEUTRAL -> SchoolEntrySalutationDto.NEUTRAL;
      case FEMALE -> SchoolEntrySalutationDto.FEMALE;
      case MALE -> SchoolEntrySalutationDto.MALE;
    };
  }

  public static SalutationDto mapToBaseSalutationDto(SchoolEntrySalutationDto salutation) {
    return switch (salutation) {
      case null -> null;
      case NOT_SPECIFIED -> SalutationDto.NOT_SPECIFIED;
      case NEUTRAL -> SalutationDto.NEUTRAL;
      case FEMALE -> SalutationDto.FEMALE;
      case MALE -> SalutationDto.MALE;
    };
  }
}
