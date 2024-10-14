/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection;

import de.eshg.lib.appointmentblock.AppointmentBlockSlotUtil;
import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedure;
import de.eshg.stiprotection.persistence.db.UserDefinedAppointment;
import java.time.Duration;
import java.time.Instant;
import org.springframework.stereotype.Service;

@Service
public class AppointmentService {
  private final AppointmentBlockSlotUtil appointmentBlockSlotUtil;

  public AppointmentService(AppointmentBlockSlotUtil appointmentBlockSlotUtil) {
    this.appointmentBlockSlotUtil = appointmentBlockSlotUtil;
  }

  public void bookAppointment(
      StiProtectionProcedure procedure, Instant start, Integer durationInMinutes) {
    checkExistingAppointment(procedure);
    AppointmentType appointmentType = AppointmentType.valueOf(procedure.getConcern().name());
    Instant end = start.plus(Duration.ofMinutes(durationInMinutes));
    appointmentBlockSlotUtil.updateAppointment(appointmentType, null, procedure, start, end);
  }

  public void bookUserDefinedAppointment(
      StiProtectionProcedure procedure, Instant start, Integer durationInMinutes) {
    Instant end = start.plus(Duration.ofMinutes(durationInMinutes));
    procedure.setUserDefinedAppointment(new UserDefinedAppointment(start, end));
  }

  private void checkExistingAppointment(StiProtectionProcedure procedure) {
    if (procedure.getUserDefinedAppointment() != null) {
      throw new BadRequestException(
          String.format(
              "Procedure step %s already has an user defined appointment.", procedure.getId()));
    }
    if (procedure.getAppointment() != null) {
      throw new BadRequestException(
          String.format(
              "Procedure step %s already has an appointment from appointment block.",
              procedure.getId()));
    }
  }
}
