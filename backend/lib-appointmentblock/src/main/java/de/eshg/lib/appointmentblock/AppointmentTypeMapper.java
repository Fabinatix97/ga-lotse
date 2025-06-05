/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.appointmentblock;

import de.eshg.lib.appointmentblock.api.AppointmentTypeConfigDto;
import de.eshg.lib.appointmentblock.api.AppointmentTypeDto;
import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import de.eshg.rest.service.error.NotFoundException;
import java.time.Duration;
import java.util.Arrays;
import java.util.UUID;

public class AppointmentTypeMapper {

  private AppointmentTypeMapper() {}

  public static AppointmentTypeDto toInterfaceType(AppointmentType appointmentType) {
    return AppointmentTypeDto.valueOf(appointmentType.name());
  }

  public static AppointmentType toDomainType(AppointmentTypeDto appointmentTypeDto) {
    return AppointmentType.valueOf(appointmentTypeDto.name());
  }

  public static AppointmentTypeConfigDto toInterfaceType(
      UUID id, AppointmentType appointmentType, long standardDurationInMinutes) {
    return new AppointmentTypeConfigDto(
        id, toInterfaceType(appointmentType), standardDurationInMinutes);
  }

  public static AppointmentTypeConfigDto toInterfaceType(
      AppointmentType appointmentType, Duration duration) {
    return new AppointmentTypeConfigDto(
        mapAppointmentTypeToUUID(appointmentType),
        toInterfaceType(appointmentType),
        duration.toMinutes());
  }

  public static UUID mapAppointmentTypeToUUID(AppointmentType appointmentType) {
    return UUID.nameUUIDFromBytes(String.valueOf(appointmentType.ordinal()).getBytes());
  }

  public static AppointmentType mapUUIDToAppointmentType(UUID id) {
    return Arrays.stream(AppointmentType.values())
        .filter(v -> mapAppointmentTypeToUUID(v).equals(id))
        .findAny()
        .orElseThrow(() -> new NotFoundException("Appointment type not found"));
  }
}
