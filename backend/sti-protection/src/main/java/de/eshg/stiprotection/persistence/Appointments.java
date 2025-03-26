/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.persistence;

import de.eshg.lib.appointmentblock.persistence.entity.Appointment;
import de.eshg.lib.appointmentblock.persistence.entity.AppointmentBlock;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedure;
import org.springframework.util.Assert;

public final class Appointments {

  private Appointments() {}

  public static void removeAppointmentFromBlock(Appointment appointment) {
    if (appointment == null) {
      return;
    }

    AppointmentBlock appointmentBlock = appointment.getAppointmentBlock();
    if (appointmentBlock == null) {
      return;
    }

    boolean removed = appointmentBlock.getAppointments().remove(appointment);
    Assert.isTrue(removed, "Failed to remove pending appointment");
  }

  public static void assertHasAppointment(StiProtectionProcedure procedure) {
    Assert.notNull(procedure, "Procedure must not be null");

    if (procedure.getAppointment() == null && procedure.getUserDefinedAppointment() == null) {
      throw new BadRequestException(
          "Procedure %s has no outstanding appointment".formatted(procedure.getExternalId()));
    }
  }
}
