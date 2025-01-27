/*
 * Copyright 2025 cronn GmbH
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
import de.eshg.stiprotection.persistence.data.AppointmentData;
import de.eshg.stiprotection.persistence.db.AppointmentHistoryEntry;
import de.eshg.stiprotection.persistence.db.AppointmentStatus;
import de.eshg.stiprotection.persistence.db.StiProtectionProcedure;
import de.eshg.stiprotection.persistence.db.UserDefinedAppointment;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
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
  private final Clock clock;

  public AppointmentService(
      CalendarApi calendarApi,
      CalendarEventApi calendarEventApi,
      AppointmentBlockSlotUtil appointmentBlockSlotUtil,
      Clock clock) {
    this.calendarApi = calendarApi;
    this.calendarEventApi = calendarEventApi;
    this.appointmentBlockSlotUtil = appointmentBlockSlotUtil;
    this.clock = clock;
  }

  public void createAppointment(StiProtectionProcedure procedure, AppointmentData appointment) {
    finalizeExistingAppointment(procedure);
    bookAppointment(procedure, appointment);
    addAppointmentHistoryEntry(procedure, appointment);
  }

  public void updateAppointment(StiProtectionProcedure procedure, AppointmentData appointment) {
    bookAppointment(procedure, appointment);
    updateAppointmentHistoryEntry(procedure, appointment);
  }

  public void cancelAppointment(StiProtectionProcedure procedure) {
    deleteAppointmentCalendarEvent(procedure);
    procedure.setAppointment(null);
    procedure.setCalendarEventId(null);
    procedure.setUserDefinedAppointment(null);
    cancelAppointmentHistoryEntry(procedure);
  }

  private void bookAppointment(StiProtectionProcedure procedure, AppointmentData appointment) {
    AppointmentType type = appointment.appointmentType();
    Instant start = appointment.appointmentStart();
    Instant end = start.plus(Duration.ofMinutes(appointment.durationInMinutes()));
    switch (appointment.appointmentBookingType()) {
      case APPOINTMENT_BLOCK -> bookBlockAppointment(procedure, type, start, end);
      case USER_DEFINED -> bookUserDefinedAppointment(procedure, start, end);
      default ->
          throw new BadRequestException(
              "Unsupported booking type: " + appointment.appointmentBookingType());
    }
  }

  private void bookBlockAppointment(
      StiProtectionProcedure procedure, AppointmentType type, Instant start, Instant end) {
    procedure.setUserDefinedAppointment(null);
    appointmentBlockSlotUtil.updateAppointment(type, null, null, procedure, start, end);
    createAppointmentCalendarEvent(procedure, start, end);
  }

  private void bookUserDefinedAppointment(
      StiProtectionProcedure procedure, Instant start, Instant end) {
    deleteAppointmentCalendarEvent(procedure);
    procedure.setAppointment(null);
    procedure.setCalendarEventId(null);
    UserDefinedAppointment userDefinedAppointment =
        Objects.requireNonNullElse(
            procedure.getUserDefinedAppointment(), new UserDefinedAppointment());
    userDefinedAppointment.setAppointmentStart(start);
    userDefinedAppointment.setAppointmentEnd(end);
    procedure.setUserDefinedAppointment(userDefinedAppointment);
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
    deleteAppointmentCalendarEvent(procedure);
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

  private void deleteAppointmentCalendarEvent(StiProtectionProcedure procedure) {
    UUID calendarEventId = procedure.getCalendarEventId();
    if (calendarEventId != null) {
      calendarEventApi.deleteBusinessCaseEvent(calendarEventId);
      procedure.setCalendarEventId(null);
    }
  }

  private static void validateAppointmentBlockGroup(Appointment appointment) {
    Assert.notNull(appointment, "Appointment should not be null.");
    AppointmentBlock appointmentBlock =
        Objects.requireNonNull(
            appointment.getAppointmentBlock(), "AppointmentBlock should not be null.");
    Objects.requireNonNull(
        appointmentBlock.getAppointmentBlockGroup(), "AppointmentBlockGroup should not be null.");
  }

  private void finalizeExistingAppointment(StiProtectionProcedure procedure) {
    if (procedure.getUserDefinedAppointment() != null) {
      AppointmentStatus status =
          determineAppointmentStatus(procedure.getUserDefinedAppointment().getAppointmentEnd());
      procedure.getAppointmentHistory().getLast().setAppointmentStatus(status);
    } else if (procedure.getAppointment() != null) {
      AppointmentStatus status =
          determineAppointmentStatus(procedure.getAppointment().getAppointmentEnd());
      procedure.getAppointmentHistory().getLast().setAppointmentStatus(status);
      if (status == AppointmentStatus.CANCELLED) {
        deleteAppointmentCalendarEvent(procedure);
      }
    }
  }

  private AppointmentStatus determineAppointmentStatus(Instant appointmentEnd) {
    return clock.instant().isAfter(appointmentEnd)
        ? AppointmentStatus.CLOSED
        : AppointmentStatus.CANCELLED;
  }

  private void addAppointmentHistoryEntry(
      StiProtectionProcedure procedure, AppointmentData appointment) {
    AppointmentHistoryEntry appointmentHistoryEntry = new AppointmentHistoryEntry();
    appointmentHistoryEntry.setAppointmentType(appointment.appointmentType());
    appointmentHistoryEntry.setAppointmentStart(appointment.appointmentStart());
    appointmentHistoryEntry.setAppointmentStatus(AppointmentStatus.OPEN);
    procedure.getAppointmentHistory().add(appointmentHistoryEntry);
  }

  private void updateAppointmentHistoryEntry(
      StiProtectionProcedure procedure, AppointmentData appointment) {
    AppointmentHistoryEntry appointmentHistoryEntry = procedure.getAppointmentHistory().getLast();
    appointmentHistoryEntry.setAppointmentType(appointment.appointmentType());
    appointmentHistoryEntry.setAppointmentStart(appointment.appointmentStart());
  }

  private void cancelAppointmentHistoryEntry(StiProtectionProcedure procedure) {
    List<AppointmentHistoryEntry> appointmentHistory = procedure.getAppointmentHistory();
    if (!appointmentHistory.isEmpty()) {
      AppointmentHistoryEntry appointmentHistoryEntry = appointmentHistory.getLast();
      appointmentHistoryEntry.setAppointmentStatus(AppointmentStatus.CANCELLED);
    }
  }

  public AppointmentHistoryEntry getOpenAppointmentHistoryEntry(StiProtectionProcedure procedure) {
    AppointmentHistoryEntry appointmentHistoryEntry = procedure.getAppointmentHistory().getLast();
    if (appointmentHistoryEntry.getAppointmentStatus() != AppointmentStatus.OPEN) {
      throw new BadRequestException(
          "Latest appointment history entry in procedure %s is not OPEN"
              .formatted(procedure.getExternalId()));
    }
    return appointmentHistoryEntry;
  }

  public String getAppointmentTimeAsString(AppointmentData appointmentData) {
    ZonedDateTime zonedDateTimeStart =
        appointmentData.appointmentStart().atZone(ZoneId.systemDefault());
    ZonedDateTime zonedDateTimeEnd =
        zonedDateTimeStart.plusMinutes(appointmentData.durationInMinutes());
    DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd.MM.yyyy");
    DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");
    String date = zonedDateTimeStart.format(dateFormatter);
    String timeStart = zonedDateTimeStart.format(timeFormatter);
    String timeEnd = zonedDateTimeEnd.format(timeFormatter);
    return "%s von %s bis %s".formatted(date, timeStart, timeEnd);
  }
}
