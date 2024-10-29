/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.pdf.identification;

import de.eshg.base.calendar.api.TimeRange;
import de.eshg.base.department.GetDepartmentInfoResponse;
import de.eshg.lib.appointmentblock.persistence.entity.Appointment;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.stiprotection.persistence.data.StiProtectionProcedureData;
import de.eshg.stiprotection.persistence.db.UserDefinedAppointment;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

public final class DocumentParameters {

  private DocumentParameters() {}

  private static final DateTimeFormatter DATE_FORMATTER =
      DateTimeFormatter.ofPattern("dd.MM.yyyy").withZone(ZoneId.systemDefault());

  private static final DateTimeFormatter TIME_FORMATTER =
      DateTimeFormatter.ofPattern("hh:mm").withZone(ZoneId.systemDefault());

  public static Department mapToDepartment(GetDepartmentInfoResponse departmentInfo) {
    return new Department(
        departmentInfo.name(),
        departmentInfo.abbreviation(),
        departmentInfo.street(),
        departmentInfo.houseNumber(),
        departmentInfo.postalCode(),
        departmentInfo.city(),
        departmentInfo.phoneNumber(),
        departmentInfo.homepage(),
        departmentInfo.email());
  }

  public static ConsultationAppointment toConsultationAppointment(
      Department department, TimeRange timeRange) {
    long durationMinutes = ChronoUnit.MINUTES.between(timeRange.start(), timeRange.end());
    return new ConsultationAppointment(
        department,
        DATE_FORMATTER.format(timeRange.start()),
        TIME_FORMATTER.format(timeRange.start()),
        String.valueOf(durationMinutes),
        "TODO: appointmentUrl",
        "TODO: registrationCode");
  }

  public static String toDocumentDate(Instant instant) {
    return DATE_FORMATTER.format(instant);
  }

  public static TimeRange toAppointmentTimeRange(StiProtectionProcedureData procedure) {
    UserDefinedAppointment userDefinedAppointment = procedure.userDefinedAppointment();
    Appointment appointment = procedure.appointment();
    UUID procedureId = procedure.id();
    if (userDefinedAppointment == null && appointment == null) {
      throw new BadRequestException(procedureId + ": There is no appointment scheduled.");
    }
    if (appointment != null && userDefinedAppointment != null) {
      throw new BadRequestException(
          procedureId + ": A user-defined or block appointment allowed, but not both.");
    }

    Instant appointmentStart =
        userDefinedAppointment != null
            ? userDefinedAppointment.getAppointmentStart()
            : appointment.getAppointmentStart();
    Instant appointmentEnd =
        userDefinedAppointment != null
            ? userDefinedAppointment.getAppointmentEnd()
            : appointment.getAppointmentEnd();

    return new TimeRange(appointmentStart, appointmentEnd);
  }
}
