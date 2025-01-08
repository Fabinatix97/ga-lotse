/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock;

import de.eshg.lib.appointmentblock.api.AppointmentTypeConfigDto;
import de.eshg.lib.appointmentblock.api.AppointmentTypeDto;
import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import de.eshg.lib.appointmentblock.persistence.entity.AppointmentTypeConfig;

public class AppointmentTypeMapper {

  private AppointmentTypeMapper() {}

  public static AppointmentTypeDto toInterfaceType(AppointmentType appointmentType) {
    return AppointmentTypeDto.valueOf(appointmentType.name());
  }

  public static AppointmentType toDomainType(AppointmentTypeDto appointmentTypeDto) {
    return AppointmentType.valueOf(appointmentTypeDto.name());
  }

  public static AppointmentTypeConfigDto toInterfaceType(
      AppointmentTypeConfig appointmentTypeConfig) {
    return new AppointmentTypeConfigDto(
        appointmentTypeConfig.getId(),
        toInterfaceType(appointmentTypeConfig.getAppointmentType()),
        appointmentTypeConfig.getStandardDurationInMinutes());
  }
}
