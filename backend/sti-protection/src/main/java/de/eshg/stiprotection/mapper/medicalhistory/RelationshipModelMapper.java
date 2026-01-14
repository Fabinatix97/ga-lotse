/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.mapper.medicalhistory;

import de.eshg.stiprotection.api.medicalhistory.RelationshipModelDto;
import de.eshg.stiprotection.persistence.db.medicalhistory.RelationshipModel;

public class RelationshipModelMapper {

  private RelationshipModelMapper() {}

  public static RelationshipModelDto toInterfaceType(RelationshipModel entity) {
    if (entity == null) {
      return null;
    }

    return switch (entity) {
      case NO_COMMITMENT -> RelationshipModelDto.NO_COMMITMENT;
      case MONOGAMOUS -> RelationshipModelDto.MONOGAMOUS;
      case OPEN -> RelationshipModelDto.OPEN;
    };
  }

  public static RelationshipModel toDatabaseType(RelationshipModelDto dto) {
    if (dto == null) {
      return null;
    }

    return switch (dto) {
      case NO_COMMITMENT -> RelationshipModel.NO_COMMITMENT;
      case MONOGAMOUS -> RelationshipModel.MONOGAMOUS;
      case OPEN -> RelationshipModel.OPEN;
    };
  }
}
