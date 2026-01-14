/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.mapper;

import de.eshg.measlesprotection.api.AccessRestrictionDto;
import de.eshg.measlesprotection.api.AccessRestrictionLetterDto;
import de.eshg.measlesprotection.persistence.db.AccessRestriction;
import de.eshg.measlesprotection.persistence.db.AccessRestrictionLetter;
import java.util.Collections;
import java.util.List;

public class AccessRestrictionMapper {
  private AccessRestrictionMapper() {}

  public static AccessRestrictionDto toInterfaceType(AccessRestriction accessRestriction) {
    if (accessRestriction != null) {
      return new AccessRestrictionDto(
          accessRestriction.getRestrictionIssuedDate(),
          accessRestriction.getRestrictionStartDate(),
          accessRestriction.getRestrictionTerminationDate(),
          lettersToInterfaceType(accessRestriction.getLetters()));
    } else {
      return null;
    }
  }

  private static List<AccessRestrictionLetterDto> lettersToInterfaceType(
      List<AccessRestrictionLetter> letters) {
    if (letters == null) {
      return Collections.emptyList();
    }
    return letters.stream().map(AccessRestrictionLetterMapper::toInterfaceType).toList();
  }
}
