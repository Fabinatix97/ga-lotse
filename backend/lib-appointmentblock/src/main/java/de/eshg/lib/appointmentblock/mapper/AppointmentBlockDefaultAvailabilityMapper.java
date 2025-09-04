/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock.mapper;

import de.eshg.lib.appointmentblock.api.AppointmentBlockDefaultAvailabilityDto;
import de.eshg.lib.appointmentblock.persistence.entity.AppointmentBlockDefaultAvailabilityConfig;

public class AppointmentBlockDefaultAvailabilityMapper {

  private AppointmentBlockDefaultAvailabilityMapper() {
    /* static mapper class */
  }

  public static AppointmentBlockDefaultAvailabilityConfig mapToDomain(
      AppointmentBlockDefaultAvailabilityDto dto) {
    AppointmentBlockDefaultAvailabilityConfig domain =
        new AppointmentBlockDefaultAvailabilityConfig();
    domain.setAvailableForCitizen(dto.availableForCitizen());
    domain.setAvailableForBulkBooking(dto.availableForBulkBooking());
    return domain;
  }
}
