/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.config.mapper;

import de.cronn.commons.lang.StreamUtil;
import de.eshg.config.api.GetOpeningHoursConfigResponse;
import de.eshg.config.api.OpeningHoursDto;
import de.eshg.config.domain.AbstractOpeningHours;
import de.eshg.rest.service.i18n.Language;
import java.util.Arrays;

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
    return new OpeningHoursDto(
        Arrays.stream(Language.values())
            .collect(StreamUtil.toLinkedHashMap(l -> l, abstractOpeningHours::get)));
  }
}
