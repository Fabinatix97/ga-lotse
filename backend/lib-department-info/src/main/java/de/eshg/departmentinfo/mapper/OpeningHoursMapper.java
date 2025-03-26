/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.departmentinfo.mapper;

import de.eshg.departmentinfo.api.GetOpeningHoursConfigResponse;
import de.eshg.departmentinfo.api.OpeningHoursDto;
import de.eshg.departmentinfo.domain.AbstractOpeningHours;

public class OpeningHoursMapper {
  private OpeningHoursMapper() {}

  public static GetOpeningHoursConfigResponse mapToResponse(AbstractOpeningHours openingHours) {
    if (openingHours.isInitialized()) {
      return new GetOpeningHoursConfigResponse(mapToDto(openingHours));
    } else {
      return new GetOpeningHoursConfigResponse(null);
    }
  }

  public static OpeningHoursDto mapToDto(AbstractOpeningHours abstractOpeningHours) {
    return new OpeningHoursDto(abstractOpeningHours.getDe(), abstractOpeningHours.getEn());
  }
}
