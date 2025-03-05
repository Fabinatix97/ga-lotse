/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.mapper;

import de.eshg.stiprotection.api.StiProcedureOriginDto;
import de.eshg.stiprotection.persistence.db.StiProcedureOrigin;

public class StiProcedureOriginMapper {

  private StiProcedureOriginMapper() {}

  public static StiProcedureOriginDto toInterfaceData(StiProcedureOrigin entity) {
    return switch (entity) {
      case null -> throw new IllegalArgumentException("StiProcedureOrigin should never be null!");
      case EMPLOYEE_PORTAL -> StiProcedureOriginDto.EMPLOYEE_PORTAL;
      case CITIZEN_PORTAL -> StiProcedureOriginDto.CITIZEN_PORTAL;
    };
  }
}
