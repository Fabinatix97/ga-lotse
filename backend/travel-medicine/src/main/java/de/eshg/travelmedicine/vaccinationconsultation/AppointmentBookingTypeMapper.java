/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccinationconsultation;

import de.eshg.lib.appointmentblock.persistence.entity.Appointment;
import de.eshg.travelmedicine.vaccinationconsultation.api.AppointmentBookingTypeDto;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.UserDefinedAppointment;
import org.springframework.stereotype.Component;

@Component
public class AppointmentBookingTypeMapper {
  public AppointmentBookingTypeDto mapToInterfaceType(
      Appointment appointment, UserDefinedAppointment userDefinedAppointment) {
    AppointmentBookingTypeDto bookingType;
    if (appointment != null) {
      bookingType = AppointmentBookingTypeDto.APPOINTMENT_BLOCK;
    } else if (userDefinedAppointment != null && !userDefinedAppointment.isCancelled()) {
      bookingType = AppointmentBookingTypeDto.USER_DEFINED;
    } else if (userDefinedAppointment != null && userDefinedAppointment.isCancelled()) {
      bookingType = AppointmentBookingTypeDto.CANCELLED;
    } else {
      bookingType = AppointmentBookingTypeDto.SELF_BOOKING;
    }
    return bookingType;
  }
}
