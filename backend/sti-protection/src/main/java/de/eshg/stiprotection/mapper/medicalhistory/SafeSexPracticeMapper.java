/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.mapper.medicalhistory;

import de.eshg.stiprotection.api.medicalhistory.SafeSexPracticeDto;
import de.eshg.stiprotection.persistence.db.medicalhistory.SafeSexPractice;

public class SafeSexPracticeMapper {

  private SafeSexPracticeMapper() {}

  public static SafeSexPracticeDto toInterfaceType(SafeSexPractice entity) {
    if (entity == null) {
      return null;
    }

    return switch (entity) {
      case ALWAYS -> SafeSexPracticeDto.ALWAYS;
      case FREQUENTLY -> SafeSexPracticeDto.FREQUENTLY;
      case OCCASIONALLY -> SafeSexPracticeDto.OCCASIONALLY;
      case NEVER -> SafeSexPracticeDto.NEVER;
    };
  }

  public static SafeSexPractice toDatabaseType(SafeSexPracticeDto dto) {
    if (dto == null) {
      return null;
    }

    return switch (dto) {
      case ALWAYS -> SafeSexPractice.ALWAYS;
      case FREQUENTLY -> SafeSexPractice.FREQUENTLY;
      case OCCASIONALLY -> SafeSexPractice.OCCASIONALLY;
      case NEVER -> SafeSexPractice.NEVER;
    };
  }
}
