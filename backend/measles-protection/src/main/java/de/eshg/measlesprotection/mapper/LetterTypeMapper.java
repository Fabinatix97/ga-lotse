/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.mapper;

import de.eshg.measlesprotection.api.LetterTypeDto;
import de.eshg.measlesprotection.persistence.db.LetterType;

public class LetterTypeMapper {

  private LetterTypeMapper() {}

  public static LetterType toDatabaseType(LetterTypeDto letterTypeDto) {
    return switch (letterTypeDto) {
      case LETTER_TO_PATIENT -> LetterType.LETTER_TO_PATIENT;
      case LETTER_TO_CUSTODIAN -> LetterType.LETTER_TO_CUSTODIANS;
      case LETTER_TO_FACILITY -> LetterType.LETTER_TO_FACILITY;
    };
  }

  public static LetterTypeDto toInterfaceType(LetterType letterType) {
    return switch (letterType) {
      case LETTER_TO_PATIENT -> LetterTypeDto.LETTER_TO_PATIENT;
      case LETTER_TO_CUSTODIANS -> LetterTypeDto.LETTER_TO_CUSTODIAN;
      case LETTER_TO_FACILITY -> LetterTypeDto.LETTER_TO_FACILITY;
    };
  }

  public static String toLabel(LetterType letterType) {
    return switch (letterType) {
      case LETTER_TO_PATIENT -> "betroffene Person";
      case LETTER_TO_CUSTODIANS -> "Personensorgeberechtigte(n)";
      case LETTER_TO_FACILITY -> "Einrichtung";
    };
  }
}
