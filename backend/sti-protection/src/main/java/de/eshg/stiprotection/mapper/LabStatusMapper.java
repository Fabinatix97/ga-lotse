/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.mapper;

import de.eshg.lib.appointmentblock.MappingUtil;
import de.eshg.stiprotection.api.LabStatusDto;
import de.eshg.stiprotection.persistence.db.LabStatus;

public class LabStatusMapper {

  private LabStatusMapper() {}

  public static LabStatusDto toInterfaceData(LabStatus entity) {
    return MappingUtil.mapEnum(LabStatusDto.class, entity);
  }
}
