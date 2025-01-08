/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.mapper.examination;

import de.eshg.stiprotection.api.examination.RapidTestDataDto;
import de.eshg.stiprotection.persistence.db.examination.RapidTestData;

public class RapidTestDataMapper {
  private RapidTestDataMapper() {}

  public static RapidTestDataDto toInterfaceType(RapidTestData entity) {
    if (entity == null) {
      return null;
    }

    return new RapidTestDataDto(entity.getNumber(), entity.getResult());
  }

  public static RapidTestData toDatabaseType(RapidTestDataDto dto) {
    if (dto == null) {
      return null;
    }

    RapidTestData entity = new RapidTestData();
    entity.setNumber(dto.number());
    entity.setResult(dto.result());
    return entity;
  }
}
