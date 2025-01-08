/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.mapper;

import de.eshg.lib.appointmentblock.AppointmentTypeMapper;
import de.eshg.lib.appointmentblock.api.AppointmentDto;
import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import de.eshg.lib.appointmentblock.persistence.entity.Appointment;
import de.eshg.stiprotection.api.CreateAppointmentRequest;
import de.eshg.stiprotection.api.CreateProcedureRequest;
import de.eshg.stiprotection.api.UpdateAppointmentRequest;
import de.eshg.stiprotection.persistence.data.AppointmentBookingType;
import de.eshg.stiprotection.persistence.data.AppointmentData;
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

  public static AppointmentData toDataType(CreateAppointmentRequest request) {
    return new AppointmentData(
        AppointmentBookingType.valueOf(request.appointmentBookingType().name()),
        AppointmentTypeMapper.toDomainType(request.appointmentType()),
        request.appointmentStart(),
        request.durationInMinutes());
  }

  public static AppointmentData toDataType(CreateProcedureRequest request) {
    return new AppointmentData(
        AppointmentBookingType.valueOf(request.appointmentBookingType().name()),
        AppointmentType.valueOf(request.concern().name()),
        request.appointmentStart(),
        request.durationInMinutes());
  }

  public static AppointmentData toDataType(
      UpdateAppointmentRequest request, AppointmentType appointmentType) {
    return new AppointmentData(
        AppointmentBookingType.valueOf(request.appointmentBookingType().name()),
        appointmentType,
        request.appointmentStart(),
        request.durationInMinutes());
  }
}
