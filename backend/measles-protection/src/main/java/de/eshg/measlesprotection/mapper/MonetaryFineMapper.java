/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.measlesprotection.mapper;

import de.eshg.measlesprotection.api.CreateMonetaryFineDto;
import de.eshg.measlesprotection.api.MonetaryFineDto;
import de.eshg.measlesprotection.persistence.db.MonetaryFine;
import java.util.List;

public class MonetaryFineMapper {

  private MonetaryFineMapper() {}

  public static MonetaryFine toDatabaseType(CreateMonetaryFineDto monetaryFineDto) {
    MonetaryFine monetaryFine = new MonetaryFine();
    monetaryFine.setFineIssuedDate(monetaryFineDto.fineIssuedDate());
    return monetaryFine;
  }

  public static MonetaryFineDto toInterfaceType(MonetaryFine monetaryFine) {
    return new MonetaryFineDto(monetaryFine.getExternalId(), monetaryFine.getFineIssuedDate());
  }

  public static List<MonetaryFineDto> toInterfaceType(List<MonetaryFine> monetaryFines) {
    return monetaryFines.stream().map(MonetaryFineMapper::toInterfaceType).toList();
  }
}
