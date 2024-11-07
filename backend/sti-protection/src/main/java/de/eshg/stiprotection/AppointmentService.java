/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection;

import de.eshg.base.calendar.CalendarApi;
import de.eshg.base.calendar.CalendarEventApi;
import de.eshg.base.calendar.api.BusinessCaseEventRequest;
import de.eshg.base.calendar.api.DetailedEvent;
import de.eshg.base.calendar.api.EventTimeData;
import de.eshg.base.calendar.api.GetUserCalendarsRequest;
import de.eshg.base.calendar.api.GetUserCalendarsResponse;
import de.eshg.base.calendar.api.UserCalendar;
import de.eshg.lib.appointmentblock.AppointmentBlockSlotUtil;
import de.eshg.lib.appointmentblock.persistence.AppointmentType;
import de.eshg.lib.appointmentblock.persistence.entity.Appointment;
import de.eshg.lib.appointmentblock.persistence.entity.AppointmentBlock;
import de.eshg.lib.appointmentblock.persistence.entity.AppointmentBlockGroup;
import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorCode;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedure;
import de.eshg.stiprotection.persistence.db.UserDefinedAppointment;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Stream;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;
import org.springframework.util.CollectionUtils;

@Service
public class AppointmentService {
  private final CalendarEventApi calendarEventApi;
  private final AppointmentBlockSlotUtil appointmentBlockSlotUtil;
  private final CalendarApi calendarApi;

  public AppointmentService(
      CalendarApi calendarApi,
      CalendarEventApi calendarEventApi,
      AppointmentBlockSlotUtil appointmentBlockSlotUtil) {
    this.calendarApi = calendarApi;
    this.calendarEventApi = calendarEventApi;
    this.appointmentBlockSlotUtil = appointmentBlockSlotUtil;
  }

  public void bookAppointment(
      StiProtectionProcedure procedure, Instant start, Integer durationInMinutes) {
    checkExistingAppointment(procedure);
    AppointmentType appointmentType = AppointmentType.valueOf(procedure.getConcern().name());
    Instant end = start.plus(Duration.ofMinutes(durationInMinutes));

    appointmentBlockSlotUtil.updateAppointment(appointmentType, null, procedure, start, end);
    createAppointmentCalendarEvent(procedure, start, end);
  }

  private void createAppointmentCalendarEvent(
      StiProtectionProcedure procedure, Instant start, Instant end) {
    List<UUID> userIds = getUserIdsFromAppointment(procedure.getAppointment());

    GetUserCalendarsResponse userCalendarsResponse =
        calendarApi.getUserCalendars(new GetUserCalendarsRequest(userIds));
    List<UUID> calendarIds =
        userCalendarsResponse.userCalendars().stream().map(UserCalendar::calendarId).toList();

    DetailedEvent appointmentEventData =
        calendarEventApi.addBusinessCaseEvent(
            new BusinessCaseEventRequest(calendarIds, new EventTimeData(start, end, false)));
    procedure.setCalendarEventId(appointmentEventData.id());
  }

  private List<UUID> getUserIdsFromAppointment(Appointment appointment) {
    validateAppointmentBlockGroup(appointment);
    AppointmentBlockGroup appointmentBlockGroup =
        appointment.getAppointmentBlock().getAppointmentBlockGroup();

    List<UUID> userIds =
        Stream.concat(
                appointmentBlockGroup.getPhysicians().stream(),
                appointmentBlockGroup.getConsultants().stream())
            .toList();

    if (CollectionUtils.isEmpty(userIds)) {
      throw new BadRequestException(
          ErrorCode.DATA_INTEGRITY_VIOLATION,
          "The AppointmentBlockGroup of the selected appointment has no physician or consultant assigned.");
    }
    return userIds;
  }

  private static void validateAppointmentBlockGroup(Appointment appointment) {
    Assert.notNull(appointment, "Appointment should not be null.");
    AppointmentBlock appointmentBlock =
        Objects.requireNonNull(
            appointment.getAppointmentBlock(), "AppointmentBlock should not be null.");
    Objects.requireNonNull(
        appointmentBlock.getAppointmentBlockGroup(), "AppointmentBlockGroup should not be null.");
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
              "Procedure %s already has an user defined appointment.", procedure.getId()));
    }
    if (procedure.getAppointment() != null) {
      throw new BadRequestException(
          String.format(
              "Procedure %s already has an appointment from appointment block.",
              procedure.getId()));
    }
  }
}
