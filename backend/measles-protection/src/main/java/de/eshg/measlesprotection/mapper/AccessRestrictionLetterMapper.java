/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.mapper;

import de.eshg.lib.procedure.domain.model.File;
import de.eshg.lib.procedure.domain.model.ProgressEntry;
import de.eshg.measlesprotection.api.AccessRestrictionLetterDto;
import de.eshg.measlesprotection.persistence.db.AccessRestrictionLetter;

public class AccessRestrictionLetterMapper {

  private AccessRestrictionLetterMapper() {}

  public static AccessRestrictionLetter toDatabaseType(AccessRestrictionLetterDto letterDto) {
    AccessRestrictionLetter letter = new AccessRestrictionLetter();
    letter.setRecipientId(letterDto.recipientId());
    letter.setSentAt(letterDto.sentAt());
    return letter;
  }

  public static AccessRestrictionLetterDto toInterfaceType(AccessRestrictionLetter letter) {
    ProgressEntry progressEntry = letter.getProgressEntry();
    File accessRestrictionDocument = null;
    if (progressEntry != null) {
      File file = progressEntry.getFile();
      if (file != null && !file.isDeleted()) {
        accessRestrictionDocument = file;
      }
    }

    return new AccessRestrictionLetterDto(
        letter.getExternalId(),
        letter.getRecipientId(),
        letter.getSentAt(),
        accessRestrictionDocument != null ? accessRestrictionDocument.getExternalId() : null);
  }
}
