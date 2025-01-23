/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.officialmedicalservice.appointment;

import de.eshg.lib.appointmentblock.api.AppointmentTypeDto;
import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import de.eshg.officialmedicalservice.appointment.api.AppointmentStateDto;
import de.eshg.officialmedicalservice.appointment.api.BookingStateDto;
import de.eshg.officialmedicalservice.appointment.api.BookingTypeDto;
import de.eshg.officialmedicalservice.appointment.api.OmsAppointmentDto;
import de.eshg.officialmedicalservice.appointment.persistence.entity.AppointmentState;
import de.eshg.officialmedicalservice.appointment.persistence.entity.BookingState;
import de.eshg.officialmedicalservice.appointment.persistence.entity.BookingType;
import de.eshg.officialmedicalservice.appointment.persistence.entity.OmsAppointment;
import java.util.Comparator;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class OmsAppointmentMapper {
  public List<OmsAppointmentDto> toInterfaceType(List<OmsAppointment> omsAppointmentList) {
    if (omsAppointmentList == null) {
      return List.of();
    }

    return omsAppointmentList.stream()
        .map(this::toInterfaceType)
        .sorted(
            Comparator.comparing(
                OmsAppointmentDto::start, Comparator.nullsLast(Comparator.naturalOrder())))
        .toList();
  }

  public OmsAppointmentDto toInterfaceType(OmsAppointment omsAppointment) {
    if (omsAppointment == null) {
      return null;
    }
    return new OmsAppointmentDto(
        omsAppointment.getId(),
        toInterfaceType(omsAppointment.getAppointmentType()),
        toInterfaceType(omsAppointment.getAppointmentState()),
        toInterfaceType(omsAppointment.getBookingState()),
        omsAppointment.getStart(),
        omsAppointment.getDuration());
  }

  public AppointmentTypeDto toInterfaceType(AppointmentType appointmentType) {
    if (appointmentType == null) {
      return null;
    }
    return AppointmentTypeDto.valueOf(appointmentType.name());
  }

  public AppointmentType toDomainType(AppointmentTypeDto appointmentTypeDto) {
    if (appointmentTypeDto == null) {
      return null;
    }
    return AppointmentType.valueOf(appointmentTypeDto.name());
  }

  public AppointmentStateDto toInterfaceType(AppointmentState appointmentState) {
    if (appointmentState == null) {
      return null;
    }
    return AppointmentStateDto.valueOf(appointmentState.name());
  }

  public BookingStateDto toInterfaceType(BookingState bookingState) {
    if (bookingState == null) {
      return null;
    }
    return BookingStateDto.valueOf(bookingState.name());
  }

  public BookingType toDomainType(BookingTypeDto bookingTypeDto) {
    if (bookingTypeDto == null) {
      return null;
    }
    return BookingType.valueOf(bookingTypeDto.name());
  }
}
