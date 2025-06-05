/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.medsabroad;

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
import de.eshg.medsabroad.persistence.database.MedsAbroadProcedure;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

@Service
public class AppointmentService {

  private static final Logger log = LoggerFactory.getLogger(AppointmentService.class);

  private final AppointmentBlockSlotUtil appointmentBlockSlotUtil;
  private final CalendarEventApi calendarEventApi;
  private final CalendarApi calendarApi;

  public AppointmentService(
      AppointmentBlockSlotUtil appointmentBlockSlotUtil,
      CalendarEventApi calendarEventApi,
      CalendarApi calendarApi) {
    this.appointmentBlockSlotUtil = appointmentBlockSlotUtil;
    this.calendarEventApi = calendarEventApi;
    this.calendarApi = calendarApi;
  }

  public void bookAppointment(
      MedsAbroadProcedure procedure, Instant appointmentStart, Integer durationInMinutes) {
    if (Objects.nonNull(appointmentStart) && Objects.nonNull(durationInMinutes)) {
      Instant appointmentEnd = appointmentStart.plus(Duration.ofMinutes(durationInMinutes));
      appointmentBlockSlotUtil.updateAppointment(
          AppointmentType.MEDS_ABROAD_CERTIFICATION,
          null,
          null,
          procedure,
          appointmentStart,
          appointmentEnd);
      createAppointmentCalendarEvent(procedure, appointmentStart, appointmentEnd);
    } else {
      log.info("AppointmentStart or durationInMinutes not set, skipping booking appointment.");
    }
  }

  private void createAppointmentCalendarEvent(
      MedsAbroadProcedure procedure, Instant start, Instant end) {
    List<UUID> userIds = extractMfaUserIdsFromAppointment(procedure.getAppointment());
    GetUserCalendarsResponse userCalendarsResponse =
        calendarApi.getUserCalendars(new GetUserCalendarsRequest(userIds));
    List<UUID> calendarIds =
        userCalendarsResponse.userCalendars().stream().map(UserCalendar::calendarId).toList();
    DetailedEvent appointmentEventData =
        calendarEventApi.addBusinessCaseEvent(
            new BusinessCaseEventRequest(calendarIds, new EventTimeData(start, end, false)));
    procedure.setCalendarEventId(appointmentEventData.id());
  }

  private List<UUID> extractMfaUserIdsFromAppointment(Appointment appointment) {
    Objects.requireNonNull(appointment, "Appointment should not be null.");
    AppointmentBlock appointmentBlock =
        Objects.requireNonNull(
            appointment.getAppointmentBlock(), "AppointmentBlock should not be null.");
    AppointmentBlockGroup appointmentBlockGroup =
        Objects.requireNonNull(
            appointmentBlock.getAppointmentBlockGroup(),
            "AppointmentBlockGroup should not be null.");
    Objects.requireNonNull(appointmentBlockGroup.getMfas(), "MFAs should not be null.");
    return appointment.getAppointmentBlock().getAppointmentBlockGroup().getMfas().stream().toList();
  }

  public void cancelAppointment(MedsAbroadProcedure procedure) {
    Appointment appointment = procedure.getAppointment();
    if (appointment == null) {
      return;
    }
    AppointmentBlock appointmentBlock = appointment.getAppointmentBlock();
    if (appointmentBlock == null) {
      return;
    }
    boolean removed = appointmentBlock.getAppointments().remove(appointment);
    Assert.isTrue(removed, "Failed to remove appointment");

    procedure.setAppointment(null);
    procedure.setCalendarEventId(null);
  }
}
