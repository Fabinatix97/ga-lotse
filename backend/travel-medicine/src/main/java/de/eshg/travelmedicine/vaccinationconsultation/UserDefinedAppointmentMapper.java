/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.travelmedicine.vaccinationconsultation;

import de.eshg.travelmedicine.vaccinationconsultation.api.PostUserDefinedAppointmentRequest;
import de.eshg.travelmedicine.vaccinationconsultation.api.UserDefinedAppointmentDto;
import de.eshg.travelmedicine.vaccinationconsultation.persistence.entity.UserDefinedAppointment;
import org.springframework.stereotype.Component;

@Component
public class UserDefinedAppointmentMapper {

  public UserDefinedAppointment toDomainType(PostUserDefinedAppointmentRequest request) {
    return new UserDefinedAppointment(request.appointmentStart(), request.appointmentEnd());
  }

  public UserDefinedAppointmentDto toInterfaceType(UserDefinedAppointment userDefinedAppointment) {
    return new UserDefinedAppointmentDto(
        userDefinedAppointment.getId(),
        userDefinedAppointment.getAppointmentStart(),
        userDefinedAppointment.getAppointmentEnd());
  }
}
