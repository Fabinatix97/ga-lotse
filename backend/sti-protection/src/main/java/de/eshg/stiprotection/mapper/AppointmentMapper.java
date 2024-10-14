/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.mapper;

import de.eshg.lib.appointmentblock.api.AppointmentDto;
import de.eshg.lib.appointmentblock.persistence.entity.Appointment;
import de.eshg.stiprotection.persistence.db.UserDefinedAppointment;

public class AppointmentMapper {

  private AppointmentMapper() {}

  public static AppointmentDto toInterfaceType(Appointment appointment) {
    if (appointment == null) {
      return null;
    }
    return new AppointmentDto(appointment.getAppointmentStart(), appointment.getAppointmentEnd());
  }

  public static AppointmentDto toInterfaceType(UserDefinedAppointment appointment) {
    if (appointment == null) {
      return null;
    }
    return new AppointmentDto(appointment.getAppointmentStart(), appointment.getAppointmentEnd());
  }

  public static AppointmentDto toInterfaceType(
      Appointment appointment, UserDefinedAppointment userDefAppointment) {
    AppointmentDto appointmentDto = toInterfaceType(appointment);
    if (appointment != null) {
      return appointmentDto;
    }
    return toInterfaceType(userDefAppointment);
  }
}
