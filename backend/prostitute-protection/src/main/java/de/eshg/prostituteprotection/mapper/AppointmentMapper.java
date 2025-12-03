/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.prostituteprotection.mapper;

import de.eshg.lib.appointmentblock.api.AppointmentDto;
import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import de.eshg.lib.appointmentblock.persistence.entity.Appointment;
import de.eshg.prostituteprotection.api.AppointmentBookingTypeDto;
import de.eshg.prostituteprotection.api.CreateProstituteProtectionProcedureRequest;
import de.eshg.prostituteprotection.api.UpdateProstituteProtectionProcedureRequest;
import de.eshg.prostituteprotection.domain.data.AppointmentData;
import de.eshg.prostituteprotection.domain.model.AppointmentBookingType;
import de.eshg.prostituteprotection.domain.model.UserDefinedAppointment;
import java.time.Instant;

public class AppointmentMapper {
  private AppointmentMapper() {}

  public static AppointmentData toDataType(CreateProstituteProtectionProcedureRequest request) {
    return toDataType(
        request.appointmentBookingType(), request.appointmentStart(), request.durationInMinutes());
  }

  public static AppointmentData toDataType(UpdateProstituteProtectionProcedureRequest request) {
    return toDataType(
        request.appointmentBookingType(), request.appointmentStart(), request.durationInMinutes());
  }

  private static AppointmentData toDataType(
      AppointmentBookingTypeDto appointmentBookingTypeDto,
      Instant appointmentStart,
      Integer appointmentDurationInMinutes) {
    return new AppointmentData(
        mapToDomain(appointmentBookingTypeDto),
        AppointmentType.PROSTITUTE_PROTECTION_CONSULTATION,
        appointmentStart,
        appointmentDurationInMinutes);
  }

  public static AppointmentDto toInterfaceType(
      Appointment appointment, UserDefinedAppointment userDefAppointment) {
    if (appointment != null) {
      return toInterfaceType(appointment);
    } else if (userDefAppointment != null) {
      return toInterfaceType(userDefAppointment);
    }
    return null;
  }

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

  static AppointmentBookingType mapToDomain(AppointmentBookingTypeDto dto) {
    return switch (dto) {
      case null -> null;
      case USER_DEFINED -> AppointmentBookingType.USER_DEFINED;
      case APPOINTMENT_BLOCK -> AppointmentBookingType.APPOINTMENT_BLOCK;
    };
  }
}
