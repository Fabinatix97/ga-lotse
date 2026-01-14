/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock;

import de.eshg.lib.appointmentblock.api.AppointmentTypeDto;
import de.eshg.lib.appointmentblock.persistence.AppointmentType;

public class AppointmentTypeMapper {

  private AppointmentTypeMapper() {}

  public static AppointmentTypeDto toInterfaceType(AppointmentType appointmentType) {
    return AppointmentTypeDto.valueOf(appointmentType.name());
  }

  public static AppointmentType toDomainType(AppointmentTypeDto appointmentTypeDto) {
    return AppointmentType.valueOf(appointmentTypeDto.name());
  }
}
