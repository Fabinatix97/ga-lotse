/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.mapper;

import de.eshg.base.GenderDto;
import de.eshg.schoolentry.api.SchoolEntryGenderDto;

public class GenderMapper {
  private GenderMapper() {}

  public static SchoolEntryGenderDto mapToSchoolEntryGenderDto(GenderDto gender) {
    return switch (gender) {
      case null -> null;
      case NOT_SPECIFIED -> SchoolEntryGenderDto.NOT_SPECIFIED;
      case DIVERSE -> SchoolEntryGenderDto.DIVERSE;
      case FEMALE -> SchoolEntryGenderDto.FEMALE;
      case MALE -> SchoolEntryGenderDto.MALE;
    };
  }

  public static GenderDto mapToBaseGenderDto(SchoolEntryGenderDto gender) {
    return switch (gender) {
      case null -> null;
      case NOT_SPECIFIED -> GenderDto.NOT_SPECIFIED;
      case DIVERSE -> GenderDto.DIVERSE;
      case FEMALE -> GenderDto.FEMALE;
      case MALE -> GenderDto.MALE;
    };
  }
}
