/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.mapper;

import de.eshg.stiprotection.api.AppointmentStatusDto;
import de.eshg.stiprotection.persistence.db.AppointmentStatus;

public class AppointmentStatusMapper {

  private AppointmentStatusMapper() {}

  public static AppointmentStatusDto toInterfaceType(AppointmentStatus entity) {
    if (entity == null) {
      return null;
    }

    return switch (entity) {
      case OPEN -> AppointmentStatusDto.OPEN;
      case CLOSED -> AppointmentStatusDto.CLOSED;
      case CANCELLED -> AppointmentStatusDto.CANCELLED;
    };
  }
}
