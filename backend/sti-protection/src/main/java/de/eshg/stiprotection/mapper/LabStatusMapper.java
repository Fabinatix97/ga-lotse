/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.mapper;

import de.eshg.stiprotection.api.LabStatusDto;
import de.eshg.stiprotection.persistence.db.LabStatus;

public class LabStatusMapper {

  private LabStatusMapper() {}

  public static LabStatusDto toInterfaceData(LabStatus entity) {
    if (entity == null) {
      return null;
    }

    return switch (entity) {
      case OPEN -> LabStatusDto.OPEN;
      case IN_PROGRESS -> LabStatusDto.IN_PROGRESS;
      case CLOSED -> LabStatusDto.CLOSED;
    };
  }
}
