/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.mapper;

import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import de.eshg.lib.procedure.domain.model.ProcedureType;
import de.eshg.rest.service.error.BadRequestException;

public final class AppointmentMapper {
  private AppointmentMapper() {}

  public static AppointmentType mapToAppointmentType(ProcedureType procedureType) {
    return switch (procedureType) {
      case REGULAR_EXAMINATION -> AppointmentType.REGULAR_EXAMINATION;
      case CAN_CHILD -> AppointmentType.CAN_CHILD;
      case ENTRY_LEVEL -> AppointmentType.ENTRY_LEVEL;
      default ->
          throw new BadRequestException(
              "Appointments are not available for ProcedureType %s".formatted(procedureType));
    };
  }
}
